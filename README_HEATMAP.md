# Cross-Repository Heatmap Generator

This document describes the automated heatmap generator for analyzing cross-repository relationships within the `heyns1000` organization.

## Overview

The heatmap generator fetches repository metadata from the GitHub API and computes relationship strengths between repositories based on:

- **Shared contributors** (60% weight)
- **Shared topics** (30% weight)
- **Dependency links** (10% weight)

The output is a JSON file containing a heatmap matrix, sector information, and analytics that can be visualized using the CrossSectorHeatmap component.

## Running Locally

### Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- GitHub personal access token (optional but recommended)

### Installation

1. Clone the repository and install dependencies:

```bash
git clone https://github.com/heyns1000/nexus-nair.git
cd nexus-nair
npm install
```

### Environment Variables

The script supports the following environment variables:

- **`GITHUB_TOKEN`** (optional but recommended): GitHub personal access token for API authentication
  - Without a token, you're subject to GitHub's unauthenticated API rate limit (60 requests/hour)
  - With a token, you get 5,000 requests/hour
  - Create a token at: https://github.com/settings/tokens
  - Requires `public_repo` scope (or `repo` for private repositories)

- **`OWNER`** (optional): GitHub username or organization to analyze
  - Default: `heyns1000`

### Running the Script

#### Basic usage (default owner: heyns1000):

```bash
npm run generate-heatmap
```

#### With authentication (recommended):

```bash
GITHUB_TOKEN=your_token_here npm run generate-heatmap
```

#### Analyze a different owner:

```bash
OWNER=another-user GITHUB_TOKEN=your_token_here npm run generate-heatmap
```

### Output

The script generates a file at:

```
data/heatmap-{owner}.json
```

For example, with the default owner:

```
data/heatmap-heyns1000.json
```

## Running via GitHub Actions

### Manual Trigger

1. Go to the [Actions tab](https://github.com/heyns1000/nexus-nair/actions) in the repository
2. Select the "Generate Repository Heatmap" workflow
3. Click "Run workflow"
4. (Optional) Enter a custom owner to analyze
5. Click the green "Run workflow" button

The workflow will:
- Check out the repository
- Set up Node.js 18
- Install dependencies
- Run the heatmap generator
- Upload the generated heatmap as an artifact

### Automated Schedule

The workflow runs automatically every night at 02:00 UTC (configured via cron schedule).

### Downloading the Artifact

After the workflow completes:

1. Go to the workflow run page
2. Scroll to the "Artifacts" section at the bottom
3. Click on `heatmap-{owner}` to download the ZIP file
4. Extract the ZIP to access the JSON file

## Output Format

The generated JSON file follows this structure:

```json
{
  "matrix": {
    "owner/repo-a": {
      "owner/repo-b": {
        "sourceId": "owner/repo-a",
        "targetId": "owner/repo-b",
        "strength": 85.5,
        "type": "repo-correlation",
        "bidirectional": true,
        "integrationPotential": 68.4,
        "strategicValue": 76.95,
        "operationalSynergy": 59.85
      }
    }
  },
  "sectors": [
    {
      "id": "owner/repo-name",
      "name": "repo-name",
      "emoji": "🟨",
      "influence": 92.3,
      "brandCount": 0,
      "totalElements": 0
    }
  ],
  "analytics": {
    "totalConnections": 42,
    "strongestConnection": 100.0,
    "averageStrength": 45.2,
    "mostInfluentialSector": "owner/repo-name"
  },
  "metadata": {
    "owner": "heyns1000",
    "generatedAt": "2025-11-14T18:00:00.000Z",
    "repositoryCount": 10,
    "generator": "nexus-nair-heatmap-generator",
    "version": "1.0.0"
  }
}
```

### Field Descriptions

#### Matrix
- **sourceId**: Full name of the source repository (e.g., "owner/repo")
- **targetId**: Full name of the target repository
- **strength**: Relationship strength (0-100), normalized across all connections
- **type**: Always "repo-correlation" for this generator
- **bidirectional**: Always true (relationships work both ways)
- **integrationPotential**: Estimated potential for integration (80% of strength)
- **strategicValue**: Strategic alignment value (90% of strength)
- **operationalSynergy**: Operational compatibility (70% of strength)

#### Sectors
- **id**: Full repository name (used as sector identifier)
- **name**: Short repository name
- **emoji**: Language-based emoji (e.g., 🟨 for JavaScript, 🐍 for Python)
- **influence**: Normalized influence score (0-100), sum of all connection strengths
- **brandCount**: Always 0 (repositories don't have brands)
- **totalElements**: Always 0 (repositories don't have elements)

#### Analytics
- **totalConnections**: Number of repository pairs with strength > 0
- **strongestConnection**: Maximum strength value across all connections
- **averageStrength**: Mean strength across all connections with strength > 0
- **mostInfluentialSector**: Repository ID with the highest influence score

## Calculation Details

### Strength Calculation

For each pair of repositories (A, B), the raw strength is calculated as:

```
strength = (sharedContributors * 0.6) + (sharedTopics * 0.3) + (hasDependency * 0.1)
```

Where:
- `sharedContributors` = (# shared contributors) / (max contributors in either repo)
- `sharedTopics` = (# shared topics) / (max topics in either repo)
- `hasDependency` = 1 if A depends on B or B depends on A, 0 otherwise

Raw strengths are then normalized to a 0-100 scale based on the maximum raw strength.

### Influence Score

Each repository's influence is the sum of all its connection strengths (as the source), normalized to 0-100 based on the maximum influence.

## Troubleshooting

### Rate Limit Errors

If you see rate limit errors:

1. Set the `GITHUB_TOKEN` environment variable with a valid token
2. Wait for the rate limit to reset (check headers in error message)
3. For GitHub Actions, the `GITHUB_TOKEN` secret is automatically available

### Authentication Errors

If you see 401 errors:

1. Verify your token is valid: https://github.com/settings/tokens
2. Ensure the token has not expired
3. Check that the token has the correct scopes (`public_repo` or `repo`)

### Empty Results

If no repositories are found:

1. Verify the owner name is correct
2. Check that the owner's repositories are public (or use a token with `repo` scope)
3. Ensure the owner has at least one repository

### Missing Dependencies

If the script fails with module errors:

```bash
npm install
```

## Integration with CrossSectorHeatmap Component

The generated JSON file can be directly consumed by the CrossSectorHeatmap React component:

```javascript
import CrossSectorHeatmap from './components/CrossSectorHeatmap';
import heatmapData from './data/heatmap-heyns1000.json';

function App() {
  return <CrossSectorHeatmap data={heatmapData} />;
}
```

## Contributing

To modify the heatmap generation logic:

1. Edit `scripts/heatmap/generate_heatmap.cjs`
2. Adjust weights in the `calculateRawStrength()` function
3. Test locally with `npm run generate-heatmap`
4. Submit a pull request with your changes

## License

MIT License - see the main repository LICENSE file for details.
