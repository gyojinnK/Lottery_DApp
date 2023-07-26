const Migrations = artifacts.require("Migrations");
// build 폴더에 있는 Migrations.json을 가져옴

module.exports = function (deployer) {
    deployer.deploy(Migrations);
};
