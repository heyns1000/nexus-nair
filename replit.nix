{ pkgs }: {
  deps = [
    pkgs.nodejs-18_x
    pkgs.postgresql
    pkgs.python311
    pkgs.python311Packages.pip
  ];
  env = {
    DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/nexus_nair";
    NODE_ENV = "development";
  };
}
