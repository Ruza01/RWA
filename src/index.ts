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

function getNumbers(): Observable<any>{
    const promise = fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error("lucky-six not found");
            }
            else {
                //ako je sve ok, treba da parsiramo
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
                // Prvo mešamo niz slučajnim redosledom
                const shuffledResponse = shuffle(response);

                //Odaberemo prvih 35 brojeva iz mesanog niza
                const selectedNumbers = shuffledResponse.slice(0,35);

                // Zatim emitujemo brojeve sa bojama svake 2 sekunde
                return interval(1000).pipe(
                    filter(i => i < selectedNumbers.length), // Zadržavamo se dok ne dostignemo kraj niza
                    map(i => {
                        const randomItem = selectedNumbers[i];
                        colorCount(randomItem.color);
                        const parity = determineParity(randomItem.id);
                        const divParr = document.createElement("div");
                        const divNeparr = document.createElement("div");
                        if(parity == 'paran'){
                            divParr.style.backgroundColor = 'blue';
                            divParr.style.width = '7px';
                            divParr.style.height = '25px';
                            divParr.style.border = '1px solid black';
                            divParr.style.marginLeft = '10px';
                            divParr.style.marginTop = '5px';
                            
                            document.querySelector(".divPar").appendChild(divParr);
                        }else{
                            divNeparr.style.backgroundColor = 'blue';
                            divNeparr.style.width = '7px';
                            divNeparr.style.height = '25px';
                            divNeparr.style.border = '1px solid black';
                            divNeparr.style.marginLeft = '10px';
                            divNeparr.style.marginTop = '5px';
                            document.querySelector(".divNepar").appendChild(divNeparr);   
                        }

                        //generise novi div
                        const newDiv = document.createElement("div");
                        newDiv.className = `kuglica${randomItem.id}`;
                        newDiv.innerHTML = `<span class="broj">${randomItem.id}</span>`;
                        newDiv.style.backgroundColor = randomItem.color;
                        newDiv.style.borderRadius = '50px';
                        newDiv.style.height = '50px';
                        newDiv.style.width = '50px';
                        newDiv.style.textAlign = 'center';
                        newDiv.style.alignItems = 'center';
                        newDiv.style.justifyContent = 'center';
                        newDiv.style.fontSize = '24px';
                        newDiv.style.fontWeight = 'bold';
                        newDiv.style.color = 'white';
                        newDiv.style.marginLeft = '36px';
                        newDiv.style.marginTop = '20px';
                        newDiv.style.border = '1px solid black';
                        if(i < 5){
                            document.querySelector('.bubanj').appendChild(newDiv);
                            newDiv.style.height = '70px';
                            newDiv.style.width = '70px';
                            newDiv.style.display = 'inline-flex';
                            newDiv.style.margin = '10px';
                        }else{
                            document.querySelector('.containerLoptice').appendChild(newDiv);
                        }
                        console.log(`Broj: ${randomItem.id}, Boja: ${randomItem.color}`);
                        if (i === 4) {
                            const sumOfFirstFive = sumFirstFiveNumbers(shuffledResponse);
                            const labelSuma = document.querySelector('.labelResult');
                            labelSuma.textContent = `${sumOfFirstFive}`;
                        }
                        if(i == selectedNumbers.length - 1){
                            const minimumNumber = findMinimumNumber(selectedNumbers);
                            //console.log(`${minimumNumber.id}`);
                            let minimalni = document.querySelector(".divMin");
                            minimalni.textContent = `${minimumNumber.id}`;
                        }
                        
                        
                    })
                );

            })
        )
        .subscribe();
}
// Funkcija za mešanje niza
function shuffle(array: any) {
    const newArray = [...array]; // Pravimo kopiju niza da ne bismo menjali originalni
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Zamena elemenata
    }
    return newArray;
}

//generateRandomNumbersAndColors();

function sumFirstFiveNumbers(shuffledResponse: any[]): number {
    return shuffledResponse.reduce((sum, current, index) => {
        if (index < 5) {
            return sum + current.id;
        }
        return sum;
    }, 0);
}

function determineParity(number: number): string {
    return number % 2 === 0 ? 'paran' : 'neparan';
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

// Funkcija za pronalaženje minimalnog elementa
function findMinimumNumber(numbers: any[]) {
    if (numbers.length === 0) {
        return null; // Ako je niz prazan, vratite null
    }

    let minimum = numbers[0]; // Pretpostavljamo da je prvi element minimum

    numbers.forEach((number) => {
        if (number.id < minimum.id) {
            minimum = number; // Ako pronađemo manji broj, postavljamo ga kao minimum
        }
    });

    return minimum;
}

function generateJackpot(){
// Kreiranje prvog observabla (obs1)
const obs1$ = new Observable((observer) => {
    setInterval(() => {
      const number = Math.round(Math.random() * 48) + 1;
      observer.next(`${number}`);
    }, 500);
  });

  // Kreiranje drugog observabla (obs2)
  const obs2$ = new Observable((observer) => {
    setInterval(() => {
      const number = Math.round(Math.random() * 48) + 1;
      observer.next(`${number}`);

    }, 500);
  });
  
  // Spajanje oba observabla koristeći merge
  const mergedObservable = merge(obs1$, obs2$);
  
  // Pretvaranje rezultata u niz i ispisivanje na ekranu
  mergedObservable.pipe(
    take(6) 
  ).subscribe((result) => {
   // Ovde dodajemo svaki broj u divJackpot
    const divJackpot = document.querySelector(".divJackpot");
    const numberElement = document.createElement("div");
    numberElement.textContent = `${result}`;
    divJackpot.appendChild(numberElement);
  });
}

generateJackpot();







/*function combineTimerAndLuckySix() {
    // Observable koji koristi timer da emituje vrednosti svakih 5 sekundi
    const timer$ = timer(0, 5000);
  
    // Observable koji dobijate iz funkcije getNumbers()
    const luckySix$ = getNumbers().pipe(
      switchMap(response => {
        // Implementacija za generisanje brojeva i boja
        return interval(1000).pipe(
            filter(i => i < response.length),
            map(i => {
                const randomItem = response[i];
                console.log(randomItem);
            })
        )
      })
    );
  
    // Kombinujte ova dva observabla koristeći zip operator
    zip(timer$, luckySix$)

      .subscribe(([_, luckySixData]) => {
        // Ovde možete raditi nešto sa podacima iz luckySixData kada timer emituje vrednost
        console.log('Podaci iz Lucky Six:', luckySixData);
      });
  }
  
  // ...
  
  // Poziv funkcije za kombinovanje timer-a i Lucky Six observabli
  combineTimerAndLuckySix();*/



/*const startButton = document.querySelector(".btn.btn-outline-success");
const stopButton = document.querySelector(".btn.btn-outline-danger");

console.log(startButton);
console.log(stopButton);

const stopClick$ = fromEvent(stopButton,'click');
const startClick$ = fromEvent(startButton,'click').pipe(
    takeUntil(stopClick$)
);

startClick$.subscribe(() => {
    generateRandomNumbersAndColors();
});*/



/*function execInterval(ob$: Observable<any>): Subscription {
    return generateRandomNumbersAndColors().pipe(
        takeUntil(ob$)
    ).subscribe((x: string) => console.log('timer' + x));
}

function createUnSubscribeButtonn(subject$: Subject<any>){
    const button = document.querySelector(".btn.btn-outline-danger") as HTMLElement;
    button.onclick = () => {
        //kad hocemo da prekinemo, praksa je, emitovanje sledece vrednsoti pa prekidanje
        console.log("Control stream closed");
        subject$.next(1);
        subject$.complete();
        
    }
}

const controlFlow$ = new Subject();

execInterval(controlFlow$);
createUnSubscribeButtonn(controlFlow$);*/











