async ({ userId }) => {
  const userGrades = await app
      .database
      .select('EvaluatedCats', ['Grade', 'CatId'], { userId });

      console.log(111);

    let catsInfo = {};
    let marks = {};
  for (let i = 0; i < userGrades.length; i++) {

    let catInfo = await app.sessions.getCat(userGrades[i].catid);

    catsInfo[userGrades[i].catid] = [catInfo.color, catInfo.eyecolor, catInfo.fluffy];
    marks[userGrades[i].catid] = userGrades[i].grade;


    //catsInfo.push((userGrades[i].catid) : [catInfo.color, catInfo.eyecolor, catInfo.fluffy]);

    //marks.push(userGrades[i].catid : userGrades[i].grade);



    //let catInfo = await app.sessions.getCat(userGrades[i].catid);


  }

  const colorValue =
  {
      "black" : 0,
      "white" : 0,
      "red" : 0,
      "grey" : 0,
      "brown" : 0
  };

  const eyeColorValue = {
      "blue" : 0,
      "green" : 0,
      "yellow" : 0
  };


  for (let i in marks){
      if (marks[i] === 0){
          colorValue[catsInfo[i][0]] += 0.1;
          eyeColorValue[catsInfo[i][1]] += 0.1;
      }
      else {
          colorValue[catsInfo[i][0]] += marks[i];
          eyeColorValue[catsInfo[i][1]] += marks[i];
      }
  };

  console.dir(colorValue);
  console.dir(eyeColorValue);

  let recomendCharacteristics = {};

  let max = "black";

  for (let i in colorValue){
      if (colorValue[i] > colorValue[max]){
          max = i;
      }
  }

  recomendCharacteristics.color = max;
  max = "blue";
  for (let i in eyeColorValue){
      if (eyeColorValue[i] > eyeColorValue[max])
          max = i;
  }
  recomendCharacteristics.eyeColor = max;

  console.dir(recomendCharacteristics);
  const color = recomendCharacteristics.color;
  const eyeColor = recomendCharacteristics.eyeColor;

  const catsId = await app
      .database
      .select('Cats', ['Id', 'eyeColor'], { color })



  let recomendCatsIds = []
let data = new Array(3)
  for (let i = 0 ; i < catsId.length; i++) {
    if (catsId[i].eyecolor === eyeColor){
      recomendCatsIds.push(catsId[i].id);
    }


    data[0] = recomendCatsIds[0]
    data[1] = recomendCatsIds[1]
    data[2] = recomendCatsIds[2]

  }




  return { result: 'success', data };
}
