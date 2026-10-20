{
  description = "tammkreiz dev shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/ac6b2166e7a9375683b8e98f860f273222337b16";
  };

  outputs = { self, nixpkgs }:
    let
      systems = [ "aarch64-darwin" "x86_64-darwin" "aarch64-linux" "x86_64-linux" ];
      forAllSystems = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
    in {
      devShells = forAllSystems (pkgs: {
        default = pkgs.mkShell {
          packages = [ pkgs.nodejs_24 pkgs.pnpm ];
        };
      });
    };
}
