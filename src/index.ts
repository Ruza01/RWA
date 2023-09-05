import {BehaviorSubject, of, Observable, Subject, Subscription, concatMap, delay, filter, from, fromEvent, interval, map, switchMap, take, takeUntil, takeWhile, tap, timer, zip, merge, toArray} from "rxjs";
import { LuckySix } from "./LuckySix";


const url = "http://localhost:3000/lucky-six";
let countRed = 0;
let countGreen = 0;
let countYellow = 0;
let countBlue = 0;
let countBlueviolet = 0;
let countOrange = 0;
let countBlack = 0;
let countBrown = 0;
let ticket = false;
let ulog = 0;
let checkBox = false;

function getNumbers(): Observable<any>{
    const promise = fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("lucky-six not found");
            }
            else {
                return response.json();
            }
        })
        .catch(err => console.log(err));
        return from(promise);
}

function generateRandomNumbersAndColors() {
    getNumbers()
        .pipe(
            switchMap(response => {
                const shuffledResponse = shuffle(response);
                const selectedNumbers = shuffledResponse.slice(0,35);                           //izdvaja podniz od niza,pocetak i kraj 0 i 35
                
                return interval(1000).pipe(
                    filter(i => i < selectedNumbers.length),                                    // Zadržavamo se dok ne dostignemo kraj niza
                    map(i => {
                        const randomItem = selectedNumbers[i];
                        colorCount(randomItem.color);
                        const parity = odrediParnost(randomItem.id);
                        const divParr = document.createElement("div");
                        const divNeparr = document.createElement("div");
                        if(parity == 'paran'){
                            divParr.className = 'paran';
                            document.querySelector(".divPar").appendChild(divParr);
                        }else{
                            divNeparr.className = 'neparan';
                            document.querySelector(".divNepar").appendChild(divNeparr);   
                        }

                        const newDiv = document.createElement("div");
                        newDiv.className = `kuglica${randomItem.id}`;
                        newDiv.innerHTML = `<span class="broj">${randomItem.id}</span>`;
                        newDiv.style.backgroundColor = randomItem.color;
                        if(i < 5){
                            document.querySelector('.bubanj').appendChild(newDiv);
                            newDiv.style.height = '70px';
                            newDiv.style.width = '70px';
                            newDiv.style.display = 'inline-flex';
                            newDiv.style.margin = '10px';
                        }else{
                            document.querySelector('.containerLoptice').appendChild(newDiv);
                        }

                        if (i === 4) {
                            const sumOfFirstFive = sumFirstFiveNumbers(shuffledResponse);
                            const labelSuma = document.querySelector('.labelResult');
                            labelSuma.textContent = `${sumOfFirstFive}`;
                        }

                        if(i == selectedNumbers.length - 1){
                            const minimumNumber = findMinimumNumber(selectedNumbers);
                            const maximumNumber = findMaximumNumber(selectedNumbers);
                            let minimalni = document.querySelector(".divMin");
                            let maximalni = document.querySelector(".divMax");
                            minimalni.textContent = `${minimumNumber.id}`;
                            maximalni.textContent = `${maximumNumber.id}`;
                        }
                        
                        
                    })
                );

            })
        )
        .subscribe();
}

function shuffle(array: any){
    const newArray = [...array];                                                             
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];                               
    }
    return newArray;
}

//generateRandomNumbersAndColors();

function sumFirstFiveNumbers(shuffledResponse: any[]): number {  
    return shuffledResponse.reduce((acc, current, index) => {
        if (index < 5) {
            return acc + current.id;
        }
        return acc;
    }, 0);
}

function odrediParnost(number: number): string {
    if(number % 2 === 0){
        return 'paran';
    }else{
        return 'neparan';
    }
}

function colorCount(color: string) {
    if(color == 'red'){
        countRed++;
        let broj1 = document.querySelector('.broj1');
        broj1.textContent = countRed.toString();

    }else if(color == 'rgb(0, 255, 0)'){
        countGreen++;
        let broj2 = document.querySelector('.broj2');
        broj2.textContent = countGreen.toString();

    }else if(color == 'rgb(205, 205, 0)'){
        countYellow++;
        let broj3 = document.querySelector('.broj3');
        broj3.textContent = countYellow.toString();

    }else if(color == 'blue'){
        countBlue++;
        let broj4 = document.querySelector('.broj4');
        broj4.textContent = countBlue.toString();

    }else if(color == 'blueviolet'){
        countBlueviolet++;
        let broj5 = document.querySelector('.broj5');
        broj5.textContent = countBlueviolet.toString();

    }else if(color == 'orangered'){
        countOrange++;
        let broj6 = document.querySelector('.broj6');
        broj6.textContent = countOrange.toString();

    }else if(color == 'black'){
        countBlack++;
        let broj7 = document.querySelector('.broj7');
        broj7.textContent = countBlack.toString();

    }else if(color == 'rgb(99, 0, 0)'){
        countBrown++;
        let broj8 = document.querySelector('.broj8');
        broj8.textContent = countBrown.toString();

    }
}

function findMinimumNumber(numbers: any[]) {
    let minimum = numbers[0]; 

    numbers.forEach((number) => {
        if (number.id < minimum.id) {
            minimum = number; 
        }
    });
    return minimum;
}

function findMaximumNumber(numbers: any[]) {
    let maximum = numbers[0]; 

    numbers.forEach((number) => {
        if (number.id > maximum.id) {
            maximum = number;
        }
    });
    return maximum;
}

function generateJackpot(){
    const stopGenerating$ = new Subject();

    const obs1$ = new Observable((observable) => {
    setInterval(() => {
      const number = Math.round(Math.random() * 48) + 1;
      observable.next(`${number}`);
    }, 500);
  });

    const obs2$ = new Observable((observable) => {
    setInterval(() => {
      const number = Math.round(Math.random() * 48) + 1;
      observable.next(`${number}`);

    }, 500);
  });
  
  const mergedObservable = merge(obs1$, obs2$);

  mergedObservable.pipe(
    takeUntil(stopGenerating$),
    take(6) 
  ).subscribe((result) => {
    const divJackpot = document.querySelector(".active");
    const numberElement = document.createElement("div");
    numberElement.className = 'numberEl';
    numberElement.textContent = `${result}`;
    divJackpot.appendChild(numberElement);
  });

  setTimeout(() => {
    stopGenerating$.next(-1);
    stopGenerating$.complete();
  }, 5000); 
}

generateJackpot();

function popuniTiket(): any {
    const returnElements: string[] = [];
    const buttons = Array.from(Array(48).keys())
                    .map((i) => document.getElementById(`button${i + 1}`));

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
            button.style.backgroundColor = 'gray';
            const buttonValue = button.textContent;
            returnElements.push(buttonValue);
            if(returnElements.length == 6){
                console.log(returnElements);
                return returnElements;
            }
      })
    });

}

document.addEventListener('DOMContentLoaded', () => {           //Konkretno, koristi se događaj 'DOMContentLoaded', što znači da će se funkcija izvršiti kada se HTML dokument potpuno učita i stranica bude spremna za interakciju s JavaScriptom.
    popuniTiket();
});

   






// function Ulog() {
//         const inputEl = document.querySelector(".form-control");
//         // da li je inputEl nadjen
//         if (inputEl instanceof HTMLInputElement) {
//             const inputValue = inputEl.textContent;
//             //const numericValue = parseFloat(inputValue);
//             console.log(inputValue);
//            //return inputValue;
//         }
// }

// Ulog();


// function startGame(){
//     if(checkBox == true){
//         ulog = Ulog();
//         console.log(ulog);
//     }
// }

// startGame();









