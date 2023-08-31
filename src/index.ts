import {BehaviorSubject, Observable, Subject, Subscription, concatMap, delay, from, interval, map, switchMap, take, takeUntil, takeWhile, tap} from "rxjs";
import { LuckySix } from "./LuckySix";


const url = "http://localhost:3000/lucky-six";

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
                const shuffledResponse = shuffle(response.slice(0,35));
                
                // Zatim emitujemo brojeve sa bojama svake 2 sekunde
                return interval(1000).pipe(
                    takeWhile(i => i < shuffledResponse.length), // Zadržavamo se dok ne dostignemo kraj niza
                    tap(i => {
                        const randomItem = shuffledResponse[i];
                        //generise novi div
                        const newDiv = document.createElement("div");
                        newDiv.className = `kuglica${randomItem.id}`;
                        newDiv.innerHTML = `<span class="broj">${randomItem.id}</span>`;
                        newDiv.style.backgroundColor = randomItem.color;
                        newDiv.style.width = '50px';
                        newDiv.style.height = '50px';
                        newDiv.style.borderRadius = '50px';
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
                        }else {
                            document.querySelector('.containerLoptice').appendChild(newDiv);
                        }

                        console.log(`Broj: ${randomItem.id}, Boja: ${randomItem.color}`);
                        
                    })
                );
            })
        )
        .subscribe();
}
// Funkcija za mešanje niza
function shuffle(array: any) {
    const newArray = [...array]; // Pravimo kopiju niza da ne bismo menjali originalni
    for (let i = newArray.length - 13; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]]; // Zamena elemenata
    }
    return newArray;
}

//generateRandomNumbersAndColors();

/*function execInterval(ob$: Observable<any>): Subscription {
    return generateRandomNumbersAndColors().pipe(
        takeUntil(ob$)
    ).subscribe((x: string) => console.log('timer' + x));
}*/

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

//execInterval(controlFlow$);
createUnSubscribeButtonn(controlFlow$);