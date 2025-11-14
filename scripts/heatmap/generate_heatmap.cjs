#!/usr/bin/env node

/**
 * Cross-Repository Heatmap Generator
 * 
 * Fetches repository metadata from GitHub API and computes a cross-repository
 * relationship heatmap based on shared contributors, topics, and dependencies.
 * 
 * Environment Variables:
 *   OWNER - GitHub owner/org to analyze (default: "heyns1000")
 *   GITHUB_TOKEN - GitHub personal access token (optional but recommended)
 * 
 * Output: data/heatmap-heyns1000.json
 */

const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const path = require('path');

// Configuration
const OWNER = process.env.OWNER || 'heyns1000';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OUTPUT_DIR = path.join(__dirname, '../../data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, `heatmap-${OWNER}.json`);

// Language to emoji mapping
const LANGUAGE_EMOJI_MAP = {
  'JavaScript': '🟨',
  'TypeScript': '🔷',
  'Python': '🐍',
  'Java': '☕',
  'Go': '🐹',
  'Ruby': '💎',
  'PHP': '🐘',
  'C++': '⚙️',
  'C#': '🎯',
  'C': '🔧',
  'Rust': '🦀',
  'Swift': '🦅',
  'Kotlin': '🅺',
  'HTML': '🌐',
  'CSS': '🎨',
  'Shell': '🐚',
  'Dockerfile': '🐳',
  'Vue': '💚',
  'React': '⚛️',
  'Angular': '🅰️'
};

// Initialize Octokit
const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: 'nexus-nair-heatmap-generator/1.0.0'
});

/**
 * Log with timestamp
 */
function log(message) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

/**
 * Warn user about missing token
 */
function checkToken() {
  if (!GITHUB_TOKEN) {
    log('⚠️  WARNING: GITHUB_TOKEN not set. Using unauthenticated API (subject to rate limits)');
    log('   Set GITHUB_TOKEN environment variable for higher rate limits.');
  } else {
    log('✓ Using authenticated GitHub API');
  }
}

/**
 * Fetch all repositories for owner with pagination
 */
async function fetchRepositories() {
  log(`Fetching repositories for owner: ${OWNER}...`);
  
  const repos = [];
  let page = 1;
  const perPage = 100;
  
  try {
    while (true) {
      const response = await octokit.repos.listForUser({
        username: OWNER,
        per_page: perPage,
        page: page,
        type: 'all'
      });
      
      repos.push(...response.data);
      log(`  Fetched ${repos.length} repositories (page ${page})...`);
      
      if (response.data.length < perPage) {
        break;
      }
      page++;
    }
    
    log(`✓ Found ${repos.length} repositories`);
    return repos;
  } catch (error) {
    if (error.status === 404) {
      log(`✗ Owner "${OWNER}" not found on GitHub`);
      throw new Error(`GitHub user or organization "${OWNER}" not found`);
    }
    throw error;
  }
}

/**
 * Fetch contributors for a repository
 */
async function fetchContributors(repoFullName) {
  try {
    const [owner, repo] = repoFullName.split('/');
    const contributors = [];
    let page = 1;
    const perPage = 100;
    
    while (contributors.length < 500 && page < 10) { // Limit to prevent excessive API calls
      const response = await octokit.repos.listContributors({
        owner,
        repo,
        per_page: perPage,
        page: page
      });
      
      if (response.data.length === 0) break;
      
      contributors.push(...response.data.map(c => c.login));
      
      if (response.data.length < perPage) break;
      page++;
    }
    
    return new Set(contributors);
  } catch (error) {
    // Repository might be empty or have no contributors
    return new Set();
  }
}

/**
 * Try to fetch package.json from repository
 */
async function fetchPackageJson(repoFullName, defaultBranch) {
  try {
    const [owner, repo] = repoFullName.split('/');
    const response = await octokit.repos.getContent({
      owner,
      repo,
      path: 'package.json',
      ref: defaultBranch
    });
    
    if (response.data.content) {
      const content = Buffer.from(response.data.content, 'base64').toString('utf8');
      return JSON.parse(content);
    }
  } catch (error) {
    // package.json not found or not accessible
    return null;
  }
}

/**
 * Extract dependencies from package.json
 */
function extractDependencies(packageJson) {
  if (!packageJson) return new Set();
  
  const deps = new Set();
  
  if (packageJson.dependencies) {
    Object.keys(packageJson.dependencies).forEach(dep => deps.add(dep));
  }
  
  if (packageJson.devDependencies) {
    Object.keys(packageJson.devDependencies).forEach(dep => deps.add(dep));
  }
  
  return deps;
}

/**
 * Fetch repository metadata including contributors, topics, and dependencies
 */
async function fetchRepositoryMetadata(repos) {
  log(`\nFetching metadata for ${repos.length} repositories...`);
  
  const metadata = new Map();
  
  for (let i = 0; i < repos.length; i++) {
    const repo = repos[i];
    log(`  [${i + 1}/${repos.length}] Processing ${repo.full_name}...`);
    
    try {
      // Fetch contributors
      const contributors = await fetchContributors(repo.full_name);
      
      // Topics are already in the repo data
      const topics = new Set(repo.topics || []);
      
      // Try to fetch package.json for dependency info
      const packageJson = await fetchPackageJson(repo.full_name, repo.default_branch);
      const dependencies = extractDependencies(packageJson);
      
      metadata.set(repo.full_name, {
        id: repo.full_name,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        language: repo.language || 'Unknown',
        contributors,
        topics,
        dependencies,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        openIssuesCount: repo.open_issues_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        htmlUrl: repo.html_url
      });
    } catch (error) {
      log(`    ⚠️  Error processing ${repo.full_name}: ${error.message}`);
      // Continue with partial data
      metadata.set(repo.full_name, {
        id: repo.full_name,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description || '',
        language: repo.language || 'Unknown',
        contributors: new Set(),
        topics: new Set(repo.topics || []),
        dependencies: new Set(),
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        openIssuesCount: repo.open_issues_count,
        createdAt: repo.created_at,
        updatedAt: repo.updated_at,
        htmlUrl: repo.html_url
      });
    }
  }
  
  log(`✓ Metadata collection complete\n`);
  return metadata;
}

/**
 * Calculate intersection size between two sets
 */
function setIntersectionSize(setA, setB) {
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  return intersection.size;
}

/**
 * Check if repoA depends on repoB
 */
function hasDependencyLink(metadataA, metadataB) {
  // Check if repoA's dependencies include repoB's name (or variations)
  const repoNameB = metadataB.name.toLowerCase();
  
  for (const dep of metadataA.dependencies) {
    if (dep.toLowerCase().includes(repoNameB) || repoNameB.includes(dep.toLowerCase())) {
      return true;
    }
  }
  
  return false;
}

/**
 * Calculate heatmap strength between two repositories
 * 
 * Weighted heuristic:
 * - Shared contributors: 60%
 * - Shared topics: 30%
 * - Dependency link: 10%
 * 
 * Returns raw score (not normalized yet)
 */
function calculateRawStrength(metadataA, metadataB) {
  if (metadataA.id === metadataB.id) {
    return 0; // No self-connections
  }
  
  // Shared contributors
  const sharedContributors = setIntersectionSize(metadataA.contributors, metadataB.contributors);
  const maxContributors = Math.max(metadataA.contributors.size, metadataB.contributors.size, 1);
  const contributorScore = (sharedContributors / maxContributors) * 0.6;
  
  // Shared topics
  const sharedTopics = setIntersectionSize(metadataA.topics, metadataB.topics);
  const maxTopics = Math.max(metadataA.topics.size, metadataB.topics.size, 1);
  const topicScore = (sharedTopics / maxTopics) * 0.3;
  
  // Dependency link (bidirectional check)
  const dependencyScore = (hasDependencyLink(metadataA, metadataB) || hasDependencyLink(metadataB, metadataA)) ? 0.1 : 0;
  
  return contributorScore + topicScore + dependencyScore;
}

/**
 * Build heatmap matrix with normalized strengths
 */
function buildHeatmapMatrix(metadata) {
  log('Computing heatmap matrix...');
  
  const repoIds = Array.from(metadata.keys());
  const rawMatrix = new Map();
  let maxRawScore = 0;
  
  // Calculate raw scores
  for (const sourceId of repoIds) {
    rawMatrix.set(sourceId, new Map());
    
    for (const targetId of repoIds) {
      if (sourceId !== targetId) {
        const rawScore = calculateRawStrength(metadata.get(sourceId), metadata.get(targetId));
        rawMatrix.get(sourceId).set(targetId, rawScore);
        maxRawScore = Math.max(maxRawScore, rawScore);
      }
    }
  }
  
  log(`  Max raw score: ${maxRawScore.toFixed(4)}`);
  
  // Normalize to 0-100 scale
  const matrix = new Map();
  
  for (const sourceId of repoIds) {
    matrix.set(sourceId, new Map());
    
    for (const targetId of repoIds) {
      if (sourceId !== targetId) {
        const rawScore = rawMatrix.get(sourceId).get(targetId);
        const normalizedStrength = maxRawScore > 0 ? (rawScore / maxRawScore) * 100 : 0;
        
        // Create HeatmapCell
        const cell = {
          sourceId,
          targetId,
          strength: Math.round(normalizedStrength * 100) / 100, // Round to 2 decimals
          type: 'repo-correlation',
          bidirectional: true,
          integrationPotential: Math.round(normalizedStrength * 0.8 * 100) / 100, // 80% of strength
          strategicValue: Math.round(normalizedStrength * 0.9 * 100) / 100, // 90% of strength
          operationalSynergy: Math.round(normalizedStrength * 0.7 * 100) / 100 // 70% of strength
        };
        
        matrix.get(sourceId).set(targetId, cell);
      }
    }
  }
  
  log('✓ Matrix computation complete\n');
  return matrix;
}

/**
 * Calculate influence score for each sector (repository)
 */
function calculateInfluenceScores(matrix, metadata) {
  log('Calculating influence scores...');
  
  const influences = new Map();
  const repoIds = Array.from(metadata.keys());
  
  // Sum of strengths across each row
  for (const sourceId of repoIds) {
    const row = matrix.get(sourceId);
    let totalStrength = 0;
    
    for (const [targetId, cell] of row) {
      totalStrength += cell.strength;
    }
    
    influences.set(sourceId, totalStrength);
  }
  
  // Normalize to 0-100
  const maxInfluence = Math.max(...influences.values(), 1);
  
  for (const [sourceId, influence] of influences) {
    const normalizedInfluence = (influence / maxInfluence) * 100;
    influences.set(sourceId, Math.round(normalizedInfluence * 100) / 100);
  }
  
  log('✓ Influence scores calculated\n');
  return influences;
}

/**
 * Build sectors array
 */
function buildSectors(metadata, influences) {
  const sectors = [];
  
  for (const [id, meta] of metadata) {
    const emoji = LANGUAGE_EMOJI_MAP[meta.language] || '📦';
    
    sectors.push({
      id,
      name: meta.name,
      emoji,
      influence: influences.get(id) || 0,
      brandCount: 0, // Repositories don't have brands
      totalElements: 0 // Repositories don't have elements
    });
  }
  
  // Sort by influence descending
  sectors.sort((a, b) => b.influence - a.influence);
  
  return sectors;
}

/**
 * Calculate analytics
 */
function calculateAnalytics(matrix, sectors) {
  log('Computing analytics...');
  
  let totalConnections = 0;
  let strongestConnection = 0;
  let totalStrength = 0;
  let connectionCount = 0;
  
  for (const [sourceId, targets] of matrix) {
    for (const [targetId, cell] of targets) {
      if (cell.strength > 0) {
        totalConnections++;
        strongestConnection = Math.max(strongestConnection, cell.strength);
        totalStrength += cell.strength;
        connectionCount++;
      }
    }
  }
  
  const averageStrength = connectionCount > 0 ? totalStrength / connectionCount : 0;
  const mostInfluentialSector = sectors.length > 0 ? sectors[0].id : null;
  
  const analytics = {
    totalConnections,
    strongestConnection: Math.round(strongestConnection * 100) / 100,
    averageStrength: Math.round(averageStrength * 100) / 100,
    mostInfluentialSector
  };
  
  log(`  Total connections: ${totalConnections}`);
  log(`  Strongest connection: ${analytics.strongestConnection}`);
  log(`  Average strength: ${analytics.averageStrength}`);
  log(`  Most influential: ${mostInfluentialSector}`);
  log('✓ Analytics computed\n');
  
  return analytics;
}

/**
 * Convert Map-based matrix to plain object for JSON serialization
 */
function convertMatrixToObject(matrix) {
  const obj = {};
  
  for (const [sourceId, targets] of matrix) {
    obj[sourceId] = {};
    
    for (const [targetId, cell] of targets) {
      obj[sourceId][targetId] = cell;
    }
  }
  
  return obj;
}

/**
 * Write heatmap data to file
 */
function writeHeatmapData(heatmapData) {
  log(`Writing output to ${OUTPUT_FILE}...`);
  
  // Create data directory if it doesn't exist
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    log(`  Created directory: ${OUTPUT_DIR}`);
  }
  
  // Write JSON file
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(heatmapData, null, 2), 'utf8');
  
  log(`✓ Heatmap data written successfully`);
  log(`  File: ${OUTPUT_FILE}`);
  log(`  Size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(2)} KB`);
}

/**
 * Main execution
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Cross-Repository Heatmap Generator');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  
  checkToken();
  
  try {
    // Step 1: Fetch repositories
    const repos = await fetchRepositories();
    
    if (repos.length === 0) {
      log('⚠️  No repositories found. Nothing to generate.');
      return;
    }
    
    // Step 2: Fetch metadata for each repository
    const metadata = await fetchRepositoryMetadata(repos);
    
    // Step 3: Build heatmap matrix
    const matrix = buildHeatmapMatrix(metadata);
    
    // Step 4: Calculate influence scores
    const influences = calculateInfluenceScores(matrix, metadata);
    
    // Step 5: Build sectors
    const sectors = buildSectors(metadata, influences);
    
    // Step 6: Calculate analytics
    const analytics = calculateAnalytics(matrix, sectors);
    
    // Step 7: Build final HeatmapData structure
    const heatmapData = {
      matrix: convertMatrixToObject(matrix),
      sectors,
      analytics,
      metadata: {
        owner: OWNER,
        generatedAt: new Date().toISOString(),
        repositoryCount: repos.length,
        generator: 'nexus-nair-heatmap-generator',
        version: '1.0.0'
      }
    };
    
    // Step 8: Write to file
    writeHeatmapData(heatmapData);
    
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✓ Heatmap generation complete!');
    console.log('═══════════════════════════════════════════════════════');
    
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('═══════════════════════════════════════════════════════');
    console.error('  ✗ Error generating heatmap');
    console.error('═══════════════════════════════════════════════════════');
    console.error('');
    console.error(`Error: ${error.message}`);
    
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    
    if (error.status === 401) {
      console.error('\nAuthentication failed. Please check your GITHUB_TOKEN.');
    } else if (error.status === 403) {
      console.error('\nAPI rate limit exceeded. Please set GITHUB_TOKEN or wait for rate limit reset.');
    }
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { main };
