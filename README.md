# Cards Against Humanatee

An online version of [Cards Against Humanity](https://cardsagainsthumanity.com/), the party game for horrible people.
With extra features such as creating your own cards, creating your own expansion packs, and playing with your friends via computer screens.

## Technologies Used
<hr>
* A full-stack MEAN(mongoDB, Express, Angular, Node) app
  * Bcrypt and JWT for auth
  * Mongoose for integration with mongoDB from express
* [socket.io](https://socket.io/) for creating separate sessions and game rooms for players
* Hosted on Heroku with mLab for database integration

## Mockups
<hr>
![View1](https://res.cloudinary.com/dov5rx5fp/image/upload/v1491177363/cah1_cz6oiu.png)
![View2](https://res.cloudinary.com/dov5rx5fp/image/upload/v1491177363/cah2_nvyhji.png)
![View3](https://res.cloudinary.com/dov5rx5fp/image/upload/v1491177364/cah3_me0yvy.png)
![View4](https://res.cloudinary.com/dov5rx5fp/image/upload/v1491177363/cah4_tfraxi.png)

## Routes
<hr>
### User/Auth
| Method        | URL           | Purpose           | Data  |
| ------------- |:-------------:|:-------------:| -----:|
| GET | /api/users |Find all users | [{User},...]|
| POST | /api/users | Creates a user if the email provided doesn't already exist in the db | {User}|


### White Card API
| Method        | URL           | Purpose           | Data  | User is logged in
| ------------- |:-------------:|:-------------:| -----:| -----:|
| GET | api/whiteCards | Get all white cards in the db that aren't user created| [ {WhiteCard},...] | FALSE |
| GET | api/whiteCards/:deckIds | Get all white cards in the db belonging to certain decks| [ {WhiteCard},...] | FALSE |
| GET | api/whiteCards/myCards/:userId | Get all white cards in the db that the current user has created | [ {WhiteCard},...] | TRUE |
| GET | api/whiteCards/myAvailableCards/:userId/:packId | Get all white cards in the db that the current user has created and that have **not** yet been put into a custom expansion pack| [ {WhiteCard},...] | TRUE |
| POST | api/whiteCards | Create a custom white card | {WhiteCard} | TRUE |
| PUT | api/whiteCards/:cardId | Update a custom white card (note: users can only update cards they have created) | {WhiteCard} | TRUE |
| DELETE | api/whiteCards/:cardId | Delete a custom white card (note: users can only delete cards they have created) | {} | TRUE |

### Black Card API
| Method        | URL           | Purpose           | Data  | User is logged in
| ------------- |:-------------:|:-------------:| -----:| -----:|
| GET | api/blackCards | Get all black cards in the db that aren't user created| [ {BlackCard},...] | FALSE |
| GET | api/blackCards/:deckIds | Get all black cards in the db belonging to certain decks| [ {BlackCard},...] | FALSE |
| GET | api/blackCards/myCards/:userId | Get all black cards in the db that the current user has created | [ {BlackCard},...] | TRUE |
| GET | api/blackCards/myAvailableCards/:userId/:packId | Get all black cards in the db that the current user has created and that have **not** yet been put into a custom expansion pack| [ {BlackCard},...] | TRUE |
| POST | api/blackCards | Create a custom black card | {BlackCard} | TRUE |
| PUT | api/blackCards/:cardId | Update a custom black card (note: users can only update cards they have created) | {BlackCard} | TRUE |
| DELETE | api/blackCards/:cardId | Delete a custom black card (note: users can only delete cards they have created) | {} | TRUE |

### Deck API
| Method        | URL           | Purpose           | Data  | User is logged in
| ------------- |:-------------:|:-------------:| -----:| -----:|
| GET | api/decks | Get all decks in the db that aren't user created and isn't the "User Created Cards" deck| [ {Deck},...] | FALSE |
| GET | api/decks/:deckName | Get a specific deck given the deck name | {Deck} | FALSE |
| GET | api/decks/myDecks/:userId | Get all decks in the db that the current user has created | [ {Deck},...] | TRUE |
| POST | api/decks | Create a new deck | {Deck} | TRUE |
| DELETE | api/decks/:deckId | Delete a custom deck (note: users can only delete decks they have created) | {} | TRUE |

## Database
<hr>
### Collections
By default all documents come with the following attributes:
* id

The database has 4 collections:
* users
* whitecards
* blackcards
* decks

### Models

#### User Model
Attributes:
* username
* email
* password

#### WhiteCard Model
Attributes:
* answer
* pack - ObjectId, references the Deck model
* userId - ObjectId, references User model

#### BlackCard Model
Attributes:
* question
* blanks
* pack - ObjectId, references the Deck model
* userId - ObjectId, references the User model

#### Deck Model
Attributes:
* name
* userId - - ObjectId, references the User model

## Interesting problems
<hr>

### Sockets
* Learning how to use sockets
* Using socket.io to create separate room instances

### Sharing data between users
For instance:
* making sure all users draw cards from the same deck of white cards and black cards
* ensuring that users don't get duplicate cards
