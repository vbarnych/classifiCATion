CREATE TABLE Cats ( Wool color Wool color coloration tail length wool length
  Id           serial,
  WoolColor    float,
  EyeColor     float,
  Coloration   float,
  TailLength   float,
  WoolLength   float
);

ALTER TABLE Cats ADD CONSTRAINT pkCats PRIMARY KEY (Id);

CREATE TABLE SystemUser (
  Id        serial,
  Login     varchar(64) NOT NULL,
  Password  varchar(255) NOT NULL,
  FullName  varchar(255)
);

ALTER TABLE SystemUser ADD CONSTRAINT pkSystemUser PRIMARY KEY (Id);
CREATE UNIQUE INDEX akSystemUserLogin ON SystemUser (Login);

CREATE TABLE EvaluatedCats (
  Id      serial,
  UserId  integer NOT NULL,
  CatId   integer NOT NULL,
  Grade   integer NOT NULL
);

ALTER TABLE EvaluatedCats ADD CONSTRAINT pkEvaluatedCats PRIMARY KEY (Id);
ALTER TABLE EvaluatedCats ADD CONSTRAINT fkEvaluatedCatsUserId FOREIGN KEY (UserId) REFERENCES SystemUser (Id) ON DELETE CASCADE;
ALTER TABLE EvaluatedCats ADD CONSTRAINT fkEvaluatedCatsCatId FOREIGN KEY (CatId) REFERENCES Cats (Id) ON DELETE CASCADE;