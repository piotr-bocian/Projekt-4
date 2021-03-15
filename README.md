# Projekt-4 SCHRONISKO DLA ZWIERZĄT - REST API *(English version below)*

## Założenia
Głównym założeniem tego projektu było stworzenie w pełni funkcjonalnego REST API połączonego ze nierelacyjną bazą danych. Do stworzenia bazy danych wykorzystaliśmy usługę Atlas od MongoDB, korzystaliśmy z metodologii MVC.

#### Schemat bazy danych(../.github/githubImage/Database.png)

### Główne technologie z jakich korzystaliśmy w projekcie to:

* Node.js
* Express.js
* Atlas MongoDB
* Mongoose
* Jest/supertest

### Wybrane paczki npm wykorzystane w projekcie
   * bcrypt
   * cookie
   * cors
   * dotenv
   * helmet
   * joi
   * jsonwebtoken
   * multer
   * nodemailer
   * winston

### Funkcjonalności:

* Wykonane przez nasz zespół REST API pozwala na obsługę zapytań: __GET__, __POST__, __DELETE__, __PUT__, __PATCH__.
* Umożliwia rejestrację oraz logowanie użytkownika.
* Zapewnia hashowanie hasła i bezpieczne jego przechowywanie w bazie danych.
* Umożliwia wysłanie e-maila do użytkownika z informacją o rejestracji.
* Zabezpiecza dostęp do określonych zapytań poprzez autentykacje oraz autoryzacje(dostep tylko dla użytkowników zalogowanych, dostęp tylko dla adminów).
* Dzięki wykorzystaniu kodowania base64 przesyłamy na serwer pliki graficzne, które będą później wykorzystane przez front-end. Dopuszczamy ograniczony rozmiar pliku graficznego.
* Wykonane REST API korzysta z podwójnej walidacji wprowadzanych danych: wbudowanej w mongoose podczas pisania schematu oraz z walidacji poprzez obiekt __joi__.
* Umożliwiamy dynamiczne wyszukiwanie w zasobach bazy danych np: wyszukiwanie płatności, wyszukiwanie zwierząt itp.


### English version

## Assumptions
The main assumption of this project was to create a fully functional REST API combined with a non-relational database. To create the database, we used the Atlas service from MongoDB, we used the MVC methodology.

## Functionalities:

* Made by our team, REST API allows you to handle queries: __GET__, __POST__, __DELETE__, __PUT__, __PATCH__.
* Enables user registration and login.
* Ensures password hashing and its safe storage in the database.
* Allows you to send an email to the user with registration information.
* Secures access to specific queries through authentication and authorization (access only for logged in users, access only for admins).
* Thanks to the use of base64 encoding, we send graphic files to the server, which will be later used by the front-end. We allow a limited size of the graphic file.
* Executed REST API uses double validation of input data: built in mongoose when writing the schema and validation through the __joi__ object.
* We enable dynamic search in database resources, e.g. payment search, animal search, etc.


# Zespół:
Team Lead: Piotr Bocian,
Product Owner: Klaudia Wojciechowska,
Tech Lead: Szymon Suchodolski,
Development Manager: Łukasz Żurawski,
Członkowie zespołu: Jan Eliasz, Adam Połynka, Daria Torz.

15/03/2021