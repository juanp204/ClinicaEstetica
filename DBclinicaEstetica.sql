-- MySQL Script generated by MySQL Workbench
-- Wed Oct 25 15:07:22 2023
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema codefest2023
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema codefest2023
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `clinica_estetica` DEFAULT CHARACTER SET utf8 ;
USE `clinica_estetica` ;

-- -----------------------------------------------------
-- Table `clinica_estetica`.`tipousuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica_estetica`.`tipousuario` (
  `idtipousuario` INT NOT NULL AUTO_INCREMENT,
  `usuario` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idtipousuario`),
  UNIQUE INDEX `idtipousuario_UNIQUE` (`idtipousuario` ASC) VISIBLE,
  UNIQUE INDEX `usuario_UNIQUE` (`usuario` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `clinica_estetica`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica_estetica`.`usuarios` (
  `idusuarios` INT NOT NULL AUTO_INCREMENT,
  `nombres` VARCHAR(45) NOT NULL,
  `apellidos` VARCHAR(45) NOT NULL,
  `passwd` VARCHAR(45) NOT NULL,
  `correo` VARCHAR(45) NOT NULL,
  `tipousuario_idtipousuario` INT NOT NULL,
  PRIMARY KEY (`idusuarios`, `tipousuario_idtipousuario`),
  INDEX `fk_usuarios_tipousuario1_idx` (`tipousuario_idtipousuario` ASC) VISIBLE,
  CONSTRAINT `fk_usuarios_tipousuario1`
    FOREIGN KEY (`tipousuario_idtipousuario`)
    REFERENCES `clinica_estetica`.`tipousuario` (`idtipousuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `clinica_estetica`.`servicios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica_estetica`.`servicios` (
  `idtipocita` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `descripcion` TEXT NOT NULL,
  `imagen` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idtipocita`),
  UNIQUE INDEX `servicio_UNIQUE` (`titulo` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `clinica_estetica`.`cita`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `clinica_estetica`.`cita` (
  `idcita` INT NOT NULL AUTO_INCREMENT,
  `FECHA` DATETIME NOT NULL,
  `tipocita_idtipocita` INT NOT NULL,
  `usuarios_idusuarios` INT NOT NULL,
  `mensaje` TEXT NULL,
  PRIMARY KEY (`idcita`, `tipocita_idtipocita`, `usuarios_idusuarios`),
  INDEX `fk_cita_tipocita1_idx` (`tipocita_idtipocita` ASC) VISIBLE,
  INDEX `fk_cita_usuarios1_idx` (`usuarios_idusuarios` ASC) VISIBLE,
  CONSTRAINT `fk_cita_tipocita1`
    FOREIGN KEY (`tipocita_idtipocita`)
    REFERENCES `clinica_estetica`.`servicios` (`idtipocita`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_cita_usuarios1`
    FOREIGN KEY (`usuarios_idusuarios`)
    REFERENCES `clinica_estetica`.`usuarios` (`idusuarios`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
