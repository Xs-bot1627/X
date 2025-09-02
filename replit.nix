{ pkgs }: {
  deps = [
    pkgs.nodejs-20
    pkgs.git
    pkgs.unzip
    pkgs.libuuid
    pkgs.cacert
  ];
}