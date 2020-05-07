CREATE TABLE Cats (
  Id           serial,
  WoolColor    float,
  EyeColor     float,
  Coloration   float,
  TailLength   float,
  WoolLength   float
);

ALTER TABLE Cats ADD CONSTRAINT pkCats PRIMARY KEY (Id);

CREATE TABLE SystemUsers (
  Id        serial,
  Login     varchar(64) NOT NULL,
  Password  varchar(255) NOT NULL,
  FullName  varchar(255)
);

ALTER TABLE SystemUsers ADD CONSTRAINT pkSystemUsers PRIMARY KEY (Id);
CREATE UNIQUE INDEX akSystemUsersLogin ON SystemUsers (Login);

CREATE TABLE EvaluatedCats (
  Id      serial,
  UserId  integer NOT NULL,
  CatId   integer NOT NULL,
  Grade   integer NOT NULL
);

ALTER TABLE EvaluatedCats ADD CONSTRAINT pkEvaluatedCats PRIMARY KEY (Id);
ALTER TABLE EvaluatedCats ADD CONSTRAINT fkEvaluatedCatsUserId FOREIGN KEY (UserId) REFERENCES SystemUsers (Id) ON DELETE CASCADE;
ALTER TABLE EvaluatedCats ADD CONSTRAINT fkEvaluatedCatsCatId FOREIGN KEY (CatId) REFERENCES Cats (Id) ON DELETE CASCADE;

CREATE TABLE Sessions (
  Id      serial,
  UserId  integer NOT NULL,
  Token   varchar(64) NOT NULL,
  Data    text
);

ALTER TABLE Sessions ADD CONSTRAINT pkSessions PRIMARY KEY (Id);
CREATE UNIQUE INDEX akSessions ON Sessions (Token);
ALTER TABLE Sessions ADD CONSTRAINT fkSessionsUserId FOREIGN KEY (UserId) REFERENCES SystemUsers (Id) ON DELETE CASCADE;
