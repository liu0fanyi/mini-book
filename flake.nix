# in flake.nix
{
  inputs = {
    # nixpkgs的位置
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    # flake-utils，比如eachDefaultSystem
    flake-utils.url = "github:numtide/flake-utils";
    # rust-overlay，提供了rust工具链
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      # 用于消除在nix flake metadata里看到的重复依赖
      inputs = { flake-utils.follows = "flake-utils"; };
    };
    # cargo build rust for nix derivation
    # crane = { url = "github:ipetkov/crane"; };
  };
  # outputs = { self, nixpkgs, flake-utils, rust-overlay, crane }:
  outputs = { self, nixpkgs, flake-utils, rust-overlay }:
    # 虽然是eachDefaultSystem，但正常nix develop实际上只针对默认环境
    flake-utils.lib.eachDefaultSystem (system:
      let
        overlays = [ (import rust-overlay) ];
        pkgs = import nixpkgs { inherit system overlays; };
        # 用于从rust-toolchain.toml里获取rust工具链
        rustToolchain = pkgs.pkgsBuildHost.rust-bin.fromRustupToolchainFile
          ./rust-toolchain.toml;
        # craneLib = (crane.mkLib pkgs).overrideToolchain rustToolchain;
        # # cf. https://crane.dev/API.html#libcleancargosource
        # src = craneLib.cleanCargoSource ./.;
        # 这里是编译过程中的相关依赖
        # 比如编译过后不需要rust工具链
        # nativeBuildInputs = with pkgs; [ rustToolchain pkg-config ];
        # 这里是运行的时候仍然需要依赖的部分
        # 比如程序运行需要sqlite的动态链接库存在(sqlite3.so啥的)
        # buildInputs = with pkgs; [ openssl sqlite ];
        # because we'll use it for both `cargoArtifacts` and `bin`
        # commonArgs = { inherit src buildInputs nativeBuildInputs; };
        # cargoArtifacts = craneLib.buildDepsOnly commonArgs;
        # bin = craneLib.buildPackage (commonArgs // { inherit cargoArtifacts; });

      in with pkgs; {
        # packages = {
        #   inherit bin;
        #   default = bin;
        # };
        devShells.default = mkShell rec {
          # inputsForm = [ bin ];
          nativeBuildInputs = with pkgs; [ pkg-config ];
          buildInputs = with pkgs; [
            # ==docker
            # dive

            # ==rust
            # rustToolchain

            # ==other
            # openssl
            # sqlite
            # sqlite
            # sqlx-cli

            # ==bevy
            # udev
            # alsa-lib
            # alsa-lib-with-plugins
            # vulkan-loader
            # xorg.libX11
            # xorg.libXcursor
            # xorg.libXi
            # xorg.libXrandr
            # libxkbcommon
            # wayland

            # ==tauri, 可以编译，但运行会报错，可能差了驱动
            # cargo-tauri
            # trunk
            # gobject-introspection
            # gtk3
            # webkitgtk_4_1

            # ==支持wasm工具
            # wabt
            # python3
            # wasm-bindgen-cli

            # ==方便输出asm
            # cargo-show-asm

            # ==rcore
            # cargo-binutils

            # ==qemu
            # qemu
            # gdb
            mdbook
            perl
            perlPackages.JSON
            # ==code-x
            # codex
            # nodejs
          ];
          # for tauri
          # WEBKIT_DISABLE_COMPOSITING_MODE = 1;
          # proxy
          http_proxy = "192.168.1.100:7890";
          https_proxy = "192.168.1.100:7890";

          LD_LIBRARY_PATH = lib.makeLibraryPath buildInputs;
          # PKG_CONFIG_PATH =
          #   "${pkgs.alsa-lib.dev}/lib/pkgconfig:${pkgs.udev.dev}/lib/pkgconfig";
        };
      });
}
