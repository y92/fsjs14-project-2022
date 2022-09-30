-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 30 sep. 2022 à 18:12
-- Version du serveur : 10.5.15-MariaDB-0+deb11u1
-- Version de PHP : 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `fsjs14_project`
--

-- --------------------------------------------------------

--
-- Structure de la table `adverts`
--

CREATE TABLE `adverts` (
  `id` int(11) NOT NULL,
  `mainPict` varchar(255) DEFAULT NULL,
  `categ` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `state` int(11) NOT NULL,
  `stateDescr` text DEFAULT NULL,
  `price` decimal(11,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `addedBy` int(11) NOT NULL,
  `addedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `lastEditOn` timestamp NULL DEFAULT NULL,
  `nbEdits` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `adverts`
--

INSERT INTO `adverts` (`id`, `mainPict`, `categ`, `title`, `description`, `state`, `stateDescr`, `price`, `quantity`, `addedBy`, `addedOn`, `lastEditOn`, `nbEdits`) VALUES
(1, NULL, 1, 'Harry Potter et le prisonnier d\'Azkaban', 'Tome 3 de la saga Harry Potter', 2, 'Quasi neuf', '5.50', 4, 1, '2022-09-26 05:46:21', NULL, 0),
(2, 'fsjs14-project/adverts-main/dioq8c54c2tcyupgxixp', 3, 'Harry Potter à l\'École des Sorciers', 'Tome 1 de la saga Harry Potter', 3, 'Plus utilisé depuis très longtemps, mais toujours en bon état', '4.99', 6, 1, '2022-09-26 05:46:21', '2022-09-16 01:18:08', 5),
(3, 'fsjs14-project/adverts-main/npxvrcmhtag21wmnc5jq', 11, 'Harry Potter l\'intégrale 8 films', 'Tous les films de la saga Harry Potter en un seul coffret', 1, 'Toujours emballé, jamais ouvert', '39.90', 4, 1, '2022-09-26 05:46:21', NULL, 0),
(4, 'fsjs14-project/adverts-main/vehynrygpxzvtbrkl0lp', 2, 'L\'Avare', 'Pièce de théâtre de Molière', 2, NULL, '3.00', 6, 1, '2022-09-26 05:46:21', '2022-09-19 02:13:32', 1),
(5, 'fsjs14-project/adverts-main/axuq6mnybarbrkjmpwsh', 12, 'FIFA 22 PS4', 'Jeu vidéo FIFA 22 sur PS4', 2, NULL, '45.00', 4, 3, '2022-09-26 05:46:21', NULL, 0),
(6, 'fsjs14-project/adverts-main/mearnava99zhejaoto2j', 15, 'Clara Luciani - Coeur', 'Album \"Coeur\" de Clara Luciani (2021)', 2, 'Quasi neuf', '18.00', 4, 3, '2022-09-26 05:46:21', '2022-09-19 18:39:57', 1),
(7, 'fsjs14-project/adverts-main/sokmpznkmyspujjhmpn4', 15, 'Renaud - les plus belles chansons', 'Les plus belles chansons de Renaud', 1, '', '16.99', 4, 3, '2022-09-26 05:46:21', NULL, 0),
(8, 'fsjs14-project/adverts-main/fvih3m8wumtkgq63yckj', 2, 'Molière - Dom Juan', 'Pièce de Molière intitulée \"Dom Juan\"', 1, NULL, '2.00', 7, 3, '2022-09-26 05:46:21', NULL, 0),
(9, 'fsjs14-project/adverts-main/pxf0fwsqzm8mj4a3qa5s', 2, 'Molière - Les Fourberies de Scapin', 'Pièce de théâtre de Molière', 3, NULL, '1.77', 6, 3, '2022-09-26 05:46:21', NULL, 0),
(10, 'fsjs14-project/adverts-main/wbnm19rqct14k4dxgoeu', 4, 'Titeuf BD n°1', 'BD 1, Dieu le sexe et les bretelles', 2, '', '5.00', 4, 3, '2022-09-26 05:46:21', NULL, 0),
(11, 'fsjs14-project/adverts-main/nvj2upmfaxwdzzaje9fi', 4, 'Titeuf BD n°2', 'BD 2 \"L\'amour c\'est pô propre\"', 2, NULL, '5.00', 4, 3, '2022-09-26 05:46:21', NULL, 0),
(12, 'fsjs14-project/adverts-main/v0jjamge9zrhae50ov55', NULL, 'Titeuf BD n°3', 'BD 3 \"Ça épate les filles\"', 2, NULL, '4.99', 4, 3, '2022-09-26 05:46:21', '2022-09-19 21:31:07', 1),
(13, 'fsjs14-project/adverts-main/tqjdlaiyw4cvifzojoe8', NULL, 'Titeuf BD n°4', 'BD 4 \"C\'est pô juste\"', 2, NULL, '5.99', 4, 3, '2022-09-26 05:46:21', NULL, 0);

-- --------------------------------------------------------

--
-- Structure de la table `advert_categs`
--

CREATE TABLE `advert_categs` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `descr` text DEFAULT NULL,
  `parent` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `advert_categs`
--

INSERT INTO `advert_categs` (`id`, `title`, `descr`, `parent`) VALUES
(1, 'Livres', NULL, NULL),
(2, 'Pièces de théâtre', NULL, 1),
(3, 'Romans', NULL, 1),
(4, 'BD', NULL, 1),
(5, 'Contes', NULL, 1),
(6, 'Nouvelles', NULL, 1),
(7, 'Manuels scolaires', NULL, 1),
(8, 'Dictionnaires', NULL, 1),
(9, 'Livres d\'arts', NULL, 1),
(10, 'CD/DVD', NULL, NULL),
(11, 'Films', NULL, 10),
(12, 'Jeux vidéo', NULL, 10),
(13, 'Jeux éducatifs', NULL, 10),
(14, 'Logiciels divers', NULL, 10),
(15, 'Musique', NULL, 10);

-- --------------------------------------------------------

--
-- Structure de la table `advert_favorites`
--

CREATE TABLE `advert_favorites` (
  `user` int(11) NOT NULL,
  `advert` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `advert_notes`
--

CREATE TABLE `advert_notes` (
  `advert` int(11) NOT NULL,
  `user` int(11) NOT NULL,
  `note` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `advert_notes`
--

INSERT INTO `advert_notes` (`advert`, `user`, `note`) VALUES
(1, 1, 10);

-- --------------------------------------------------------

--
-- Structure de la table `advert_picts`
--

CREATE TABLE `advert_picts` (
  `id` int(11) NOT NULL,
  `advert` int(11) NOT NULL,
  `pictUrl` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `advert_questions`
--

CREATE TABLE `advert_questions` (
  `id` int(11) NOT NULL,
  `advert` int(11) NOT NULL,
  `question` text NOT NULL,
  `askedBy` int(11) NOT NULL,
  `askedOn` datetime NOT NULL,
  `answer` text DEFAULT NULL,
  `answeredBy` int(11) DEFAULT NULL,
  `answeredOn` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `advert_questions`
--

INSERT INTO `advert_questions` (`id`, `advert`, `question`, `askedBy`, `askedOn`, `answer`, `answeredBy`, `answeredOn`) VALUES
(1, 10, 'test juste pour poser une question', 4, '2022-09-20 05:57:45', 'test réponse', 3, '2022-09-22 05:43:28'),
(3, 2, 'test question 1', 3, '2022-09-30 09:01:22', NULL, NULL, NULL),
(5, 2, 'encore un test 3', 3, '2022-09-30 09:01:39', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Structure de la table `advert_states`
--

CREATE TABLE `advert_states` (
  `id` int(11) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `advert_states`
--

INSERT INTO `advert_states` (`id`, `state`) VALUES
(1, 'Neuf'),
(2, 'Très bon état'),
(3, 'Bon état'),
(4, 'Assez bon état'),
(5, 'Autre');

-- --------------------------------------------------------

--
-- Structure de la table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(255) NOT NULL,
  `client` int(11) NOT NULL,
  `address` varchar(255) NOT NULL,
  `zip` int(11) NOT NULL,
  `city` varchar(255) NOT NULL,
  `orderedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `orders`
--

INSERT INTO `orders` (`id`, `client`, `address`, `zip`, `city`, `orderedOn`) VALUES
('9778e6614b471d81355d6cf0f97ccbe8', 4, '88 Rue Jesaispas', 78965, 'Trucmachin', '2022-09-24 10:05:46');

-- --------------------------------------------------------

--
-- Structure de la table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `orderId` varchar(255) NOT NULL,
  `advert` int(11) NOT NULL,
  `priceUnit` decimal(11,2) NOT NULL,
  `quantity` int(11) NOT NULL,
  `orderedOn` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `state` int(11) NOT NULL,
  `sellerComment` text DEFAULT NULL,
  `answeredOn` timestamp NULL DEFAULT NULL,
  `sentOn` timestamp NULL DEFAULT NULL,
  `receivedOn` timestamp NULL DEFAULT NULL,
  `clientNote` int(11) DEFAULT NULL,
  `clientComment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `order_details`
--

INSERT INTO `order_details` (`id`, `orderId`, `advert`, `priceUnit`, `quantity`, `orderedOn`, `state`, `sellerComment`, `answeredOn`, `sentOn`, `receivedOn`, `clientNote`, `clientComment`) VALUES
(46, '9778e6614b471d81355d6cf0f97ccbe8', 8, '2.00', 3, '2022-09-26 05:46:21', 4, 'test annulation', '2022-09-26 05:46:21', NULL, NULL, NULL, NULL),
(47, '9778e6614b471d81355d6cf0f97ccbe8', 9, '1.77', 2, '2022-09-26 07:53:44', 1, '', '2022-09-26 05:47:53', '2022-09-26 06:04:07', '2022-09-26 07:53:44', 4, 'bien reçu, merci à vous');

-- --------------------------------------------------------

--
-- Structure de la table `order_states`
--

CREATE TABLE `order_states` (
  `id` int(11) NOT NULL,
  `state` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `order_states`
--

INSERT INTO `order_states` (`id`, `state`) VALUES
(1, 'Reçue'),
(2, 'Expédiée'),
(3, 'Confirmée par le vendeur'),
(4, 'Annulée par le vendeur'),
(5, 'Payée, à confirmer par le vendeur'),
(6, 'À payer');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `login` varchar(255) NOT NULL,
  `firstName` varchar(90) NOT NULL,
  `lastName` varchar(90) NOT NULL,
  `birthDate` date NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `email` varchar(90) NOT NULL,
  `password` varchar(120) NOT NULL,
  `address` varchar(90) NOT NULL,
  `zip` int(5) NOT NULL,
  `city` varchar(90) NOT NULL,
  `role` int(11) NOT NULL,
  `account` decimal(11,2) NOT NULL DEFAULT 0.00,
  `registeredOn` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `login`, `firstName`, `lastName`, `birthDate`, `photo`, `email`, `password`, `address`, `zip`, `city`, `role`, `account`, `registeredOn`) VALUES
(1, 'Alain-Terrieur', 'Alain', 'Terrieur', '1999-12-26', 'fsjs14-project/members/q2awcg6zilktozfuhkbb', 'alain.terrieur@jesaispas.fr', '$2b$11$vKLxAsGO7OhUhUXeiK6r6ulxtqMV7DQiVitjYW3p68MJBwadrxOHK', '55 rue de je sais quoi', 98765, 'Chépa', 3, '245.00', '2022-09-01 02:10:14'),
(2, 'pn', 'p', 'n', '0000-00-00', NULL, 'se@po.d', '$2b$11$Rf4HkqpMp86uQ/Ijj0WGhuQ9DvoziKIkV8cXxdsXzhaDfcd2hANeG', '55 rue de fdd', 96543, 'nulpar', 1, '0.00', '2022-09-01 02:33:53'),
(3, 'az41', 'Agathe', 'Zepower', '1988-10-29', NULL, 'az41@fr.dd', '$2b$11$.bb91w2kRkfmFpSuX/2B4euZSsp1eroYFFHIgKSK7t4ZKBy22wqHG', '88 rue machin', 88888, 'chéplu', 1, '193.54', '2022-09-19 16:25:54'),
(4, 'lolo55', 'Laurent', 'Outan', '2000-11-19', NULL, 'lolo55@ers.ze', '$2b$11$n33h7BRvV85hrWBaUW4IEOLmTyxUVYh1Ae44a29jR6P0JtWyHA5vS', '55 rue je sais pas', 43210, 'eezz', 1, '21.00', '2022-09-20 04:33:59');

-- --------------------------------------------------------

--
-- Structure de la table `user_roles`
--

CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `level` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `user_roles`
--

INSERT INTO `user_roles` (`id`, `name`, `level`) VALUES
(1, 'member', 1),
(2, 'moderator', 2),
(3, 'admin', 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `adverts`
--
ALTER TABLE `adverts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categ` (`categ`),
  ADD KEY `state` (`state`),
  ADD KEY `addedBy` (`addedBy`);

--
-- Index pour la table `advert_categs`
--
ALTER TABLE `advert_categs`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `advert_favorites`
--
ALTER TABLE `advert_favorites`
  ADD PRIMARY KEY (`user`,`advert`);

--
-- Index pour la table `advert_notes`
--
ALTER TABLE `advert_notes`
  ADD PRIMARY KEY (`advert`,`user`) USING BTREE;

--
-- Index pour la table `advert_picts`
--
ALTER TABLE `advert_picts`
  ADD KEY `advert` (`advert`);

--
-- Index pour la table `advert_questions`
--
ALTER TABLE `advert_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `advert` (`advert`),
  ADD KEY `answeredBy` (`answeredBy`),
  ADD KEY `askedBy` (`askedBy`);

--
-- Index pour la table `advert_states`
--
ALTER TABLE `advert_states`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `client` (`client`);

--
-- Index pour la table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `advert` (`advert`),
  ADD KEY `state` (`state`),
  ADD KEY `orderId` (`orderId`);

--
-- Index pour la table `order_states`
--
ALTER TABLE `order_states`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD KEY `role` (`role`);

--
-- Index pour la table `user_roles`
--
ALTER TABLE `user_roles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `adverts`
--
ALTER TABLE `adverts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT pour la table `advert_categs`
--
ALTER TABLE `advert_categs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT pour la table `advert_questions`
--
ALTER TABLE `advert_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `advert_states`
--
ALTER TABLE `advert_states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT pour la table `order_states`
--
ALTER TABLE `order_states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pour la table `user_roles`
--
ALTER TABLE `user_roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `adverts`
--
ALTER TABLE `adverts`
  ADD CONSTRAINT `adverts_ibfk_1` FOREIGN KEY (`categ`) REFERENCES `advert_categs` (`id`),
  ADD CONSTRAINT `adverts_ibfk_2` FOREIGN KEY (`state`) REFERENCES `advert_states` (`id`),
  ADD CONSTRAINT `adverts_ibfk_3` FOREIGN KEY (`addedBy`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `advert_categs`
--
ALTER TABLE `advert_categs`
  ADD CONSTRAINT `advert_categs_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `advert_categs` (`id`);

--
-- Contraintes pour la table `advert_favorites`
--
ALTER TABLE `advert_favorites`
  ADD CONSTRAINT `advert_favorites_ibfk_1` FOREIGN KEY (`user`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `advert_favorites_ibfk_2` FOREIGN KEY (`advert`) REFERENCES `adverts` (`id`);

--
-- Contraintes pour la table `advert_notes`
--
ALTER TABLE `advert_notes`
  ADD CONSTRAINT `advert_notes_ibfk_1` FOREIGN KEY (`advert`) REFERENCES `adverts` (`id`),
  ADD CONSTRAINT `advert_notes_ibfk_2` FOREIGN KEY (`user`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `advert_picts`
--
ALTER TABLE `advert_picts`
  ADD CONSTRAINT `advert_picts_ibfk_1` FOREIGN KEY (`advert`) REFERENCES `adverts` (`id`);

--
-- Contraintes pour la table `advert_questions`
--
ALTER TABLE `advert_questions`
  ADD CONSTRAINT `advert_questions_ibfk_1` FOREIGN KEY (`advert`) REFERENCES `adverts` (`id`),
  ADD CONSTRAINT `advert_questions_ibfk_2` FOREIGN KEY (`answeredBy`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `advert_questions_ibfk_3` FOREIGN KEY (`askedBy`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`client`) REFERENCES `users` (`id`);

--
-- Contraintes pour la table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`advert`) REFERENCES `adverts` (`id`),
  ADD CONSTRAINT `order_details_ibfk_3` FOREIGN KEY (`state`) REFERENCES `order_states` (`id`),
  ADD CONSTRAINT `order_details_ibfk_4` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`);

--
-- Contraintes pour la table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role`) REFERENCES `user_roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
