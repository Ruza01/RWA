import {BehaviorSubject, of, Observable, Subject, Subscription, concatMap, delay, filter, from, fromEvent, interval, map, switchMap, take, takeUntil, takeWhile, tap, timer, zip, merge, toArray, elementAt} from "rxjs";
import { LuckySix } from "./LuckySix";
import { resolve } from "../webpack.config";


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
let ulog = false;
let cb = false;
const nizBrojeva: any[] = [];
const returnElements: any[] = []; 
let generatedNumbers: any[] = []; 
let ticketNumbers: any[] = [];
let i = 0;
let inputValue: any;

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

function generateRandomNumbersAndColors(): any {
    return new Promise((resolve) => {
        getNumbers()
        .pipe(
            switchMap(response => {
                const shuffledResponse = shuffle(response);
                const selectedNumbers = shuffledResponse.slice(0,35);                           
                
                return interval(1000).pipe(
                    filter(i => i < selectedNumbers.length),                                   
                    map(i => {
                        const randomItem = selectedNumbers[i];
                        nizBrojeva.push(randomItem.id);
                        console.log(randomItem.id);
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
                        newDiv.innerHTML = `<span class="broj">${randomItem.id}`;
                        newDiv.style.backgroundColor = randomItem.color;
                        if(i < 5){
                            document.querySelector('.bubanj').appendChild(newDiv);
                            newDiv.style.height = '70px';
                            newDiv.style.width = '70px';
                            newDiv.style.display = 'inline-flex';
                            newDiv.style.margin = '10px';
                        }else{
                            newDiv.innerHTML = `<span class="broj">${randomItem.id}</span><p class="kvota">${izracunajKvotu(i)}</p>`;
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
                            resolve(nizBrojeva);
                        }

                        console.log(nizBrojeva);
                        //return nizBrojeva;
                        
                        
                    })
                );

            })
        )
        .subscribe();
    });
}

function shuffle(array: any){
    const newArray = [...array];                                                             
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];                               
    }
    return newArray;
}

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

function generateJackpot(): any{
    return new Promise<void>((resolve) => { 
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
            resolve();
        }, 5000); 

    });


}

function popuniTiket(): any {
    return new Promise<void>((resolve) => {
        const buttons = Array.from(Array(48).keys())
            .map((i) => document.getElementById(`button${i + 1}`));

        buttons.forEach((button) => {
            button.addEventListener('click', () => {
                button.style.backgroundColor = 'gray';
                const buttonValue = button.textContent;
                returnElements.push(parseInt(buttonValue));
                if (returnElements.length == 6) {
                    console.log(returnElements);
                    ticket = true;
                    resolve();
                    return returnElements;
                }
            });
        });
    });
}
//Konkretno, koristi se događaj 'DOMContentLoaded', što znači da će se funkcija izvršiti kada se HTML dokument potpuno učita i stranica bude spremna za interakciju s JavaScriptom.
function izracunajKvotu(index: number): number{
    if(index == 5){
        return 10000;
    }else if(index == 6){
        return 7500;
    }else if(index == 7){
        return 5000;
    }else if(index == 8){
        return 2500;
    }else if(index == 9){
        return 1000;
    }else if(index == 10){
        return 500;
    }else if(index == 11){
        return 300;
    }else if(index == 12){
        return 200;
    }else if(index == 13){
        return 150;
    }else if(index == 14){
        return 100;
    }else if(index == 15){
        return 90;
    }else if(index == 16){
        return 80;
    }else if(index == 17){
        return 70;
    }else if(index == 18){
        return 60;
    }else if(index == 19){
        return 50;
    }else if(index == 20){
        return 40;
    }else if(index == 21){
        return 30;
    }else if(index == 22){
        return 25;
    }else if(index == 23){
        return 20;
    }else if(index == 24){
        return 15;
    }else if(index == 25){
        return 10;
    }else if(index == 26){
        return 9;
    }else if(index == 27){
        return 8;
    }else if(index == 28){
        return 7;
    }else if(index == 29){
        return 6;
    }else if(index == 30){
        return 5;
    }else if(index == 31){
        return 4;
    }else if(index == 32){
        return 3;
    }else if(index == 33){
        return 2;
    }else  if(index == 34){
        return 1;
    }else return 0;

    
}

function getUlog() {
    return new Promise<void>((resolve) => {
        const numberInput = document.getElementById('numberInput') as HTMLInputElement;
        numberInput.addEventListener('input', () => {
            inputValue = numberInput.value;
            ulog = true;
            console.log(inputValue);
            resolve();
        });
    });
}

function isChecked() {
    return new Promise<void>((resolve) => {
        const checkBox = document.getElementById('checkBoxxx') as HTMLInputElement;
        checkBox.addEventListener('click', () => {
            if (checkBox.checked) {
                cb = true;
                console.log('checked');
            } else {
                cb = false;
                console.log('notChecked');
            }
            resolve();
        });
    });
}

async function startGame() {
    await popuniTiket();             //bez await-a, funkcije bi se izvrsavale asinhrono, odnosno pre nego sto bi se desili odgovarajuci eventListener-i(pre nego da korisnik interaguje sa stranicom)
    await getUlog();
    await isChecked();

    if (ticket && ulog && cb) {
        await generateJackpot();
        await generateRandomNumbersAndColors();
        await win(returnElements,nizBrojeva);

    }
}


document.addEventListener('DOMContentLoaded', () => {
    startGame();
});

function restartGame() {
    const restartButton = document.getElementById('restartBalls');
    restartButton.addEventListener('click', () => {
        location.reload(); 
    });
}

document.addEventListener('DOMContentLoaded', () => {
    restartGame();
});

function win(returnElements: any[], nizBrojeva: any[]): void {
    let foundNumbers: any[] = [];
    
    returnElements.forEach((element: any) => {
        if (nizBrojeva.includes(element)) {
            foundNumbers.push(element);
            i++;
            console.log(`Element ${element}, a ubacujem u niz ${foundNumbers}`);
        }
    });

    let lastNumber = foundNumbers[i];

    if (foundNumbers.length === 6) {
        let index = findIndexInNizBrojeva(lastNumber);
        console.log(index);
        let kvota = izracunajKvotu(index);
        console.log(kvota);
        let calculateWin = kvota * inputValue;
        alert(`Čestitamo, dobili ste ${calculateWin}RSD!`);
    } else {
        alert("Više sreće drugi put!");
    }

}

function findIndexInNizBrojeva(broj: number): number {
    const index = nizBrojeva.indexOf(broj);
    return index;
}




