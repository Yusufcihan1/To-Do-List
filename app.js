//Tüm elemanları Seçiyoruz
const form = document.querySelector('#todoAddForm'); //Form öğesini ekledik
const addInput = document.querySelector('#todoName'); //Input öğesini ekledik 
const todoList = document.querySelector('.list-group'); //Liste öğesini ekledik 
const firstCardBody = document.querySelectorAll('.card-body')[0]; //Alarmlar için card body öğesini ekledik
const secondCardBody = document.querySelectorAll('.card-body')[1];//iki tane vardı ikisinide ekledik
const clearButton = document.querySelector('#clearButton');//Clear buton öğesini ekledik
const filterInput = document.querySelector('#todoSearch');
let todos = [];
runEvents();
function runEvents() {
    form.addEventListener('submit', addTodo); //Form öğesin submit edilirse addTodo fonksiyonunu çalıştır.
    document.addEventListener('DOMContentLoaded',pageLoad); //sayfa yüklendiğinde gerçekleştirilecek etkinliği oluşturduk
    secondCardBody.addEventListener('click',removeTodoToUI); //Secon kart body'ye tıklandığında arayüzden kaldır
    clearButton.addEventListener('click',clearAll);//Bu butonuma click yapıldığında bu fonksiyonu çalıştır
    filterInput.addEventListener('keyup',filter); //Keyup : klavyeden elimi çektiğim an çalıştır 
    todoList.addEventListener('click',complete);
}

function pageLoad() { 
  checkTodosFromStorage();//storage'daki arrayleri çağırdık
  todos.forEach(function(todo){ //her bir array'i
    addTodoToUI(todo); //UI arayüzüne yazdır.
    
  });
}
function complete(e){
    const target = e.target;
if (target.classList.contains('list-group-item')) {
    if (target.style.color !== 'white') {
        target.style.backgroundColor = '#00994C';
        target.style.color = 'white';
        target.style.textDecoration = 'line-through red';
        // Stil öğelerini local storage'a kaydet
        localStorage.setItem('itemStyle', JSON.stringify({
            backgroundColor: '#00994C',
            color: 'white',
            textDecoration: 'line-through red'
        }));
    } else {
        target.style.backgroundColor = '#ffffff';
        target.style.color = 'black';
        target.style.textDecoration = 'none';
        // Stil öğelerini local storage'a kaydet
        localStorage.setItem('itemStyle', JSON.stringify({
            backgroundColor: '#ffffff',
            color: 'black',
            textDecoration: 'none'
        }));
    }
}

    
}
function filter(e){
    const filterValue = e.target.value.toLowerCase().trim(); //büyük küçük harf hassasiyeti olması için hepsini küçük harfe çevirdik
    const todoListesi = document.querySelectorAll(".list-group-item"); //class'ı list olan bütün elemanları seçtik
    if (todoListesi.length>0) { //eğer listenin içinde eleman varsa 
    todoListesi.forEach(function(todo){  //bütün elemanları al
        if (todo.textContent.toLowerCase().trim().includes(filterValue)) { //içlerindeki text içeriğinin hepsini küçük harfe çevir sağdan soldan boşlukları kes ve yazdığımız değeri listedeki değeri'içeriyorsa'
        todo.setAttribute("style", "display: block"); // display block yap görünür olsun
        }else{ // eğer ki içermiyorsa 
            todo.setAttribute("style", "display: none !important"); //display none yap ama important yap ki bootstrap class önceliği ortadan kalksın ve veriler görünmesin
        }
    });
    }else{
        showAlert("warning", "Filtreleme yapmak için etkinlik ekleyin");
    }

    
}
function clearAll(){
    const todoListesi = document.querySelectorAll(".list-group-item"); //class'ı list olan bütün elemanları seçtik
    if(todoListesi.length>0){ //eğer bu listede eleman varsa 
        todoListesi.forEach(function(todo){//her birini bul 
        todo.remove(); //ve ekrandan sil

        });
        todos = []; //todos array listini boşalt
        localStorage.setItem("todos",JSON.stringify(todos)); //boş halini kaydet
        showAlert("success","Tüm etkinlikler kaldırıldı."); //başarıyla kaldırıldı
    }else{ //eğer listede eleman yoksa 
        showAlert("warning","Silmek için en az 1 veri olmalıdır") //uyarı ver
    }
}
function removeTodoToUI(e){ //silme işlemi için fonksiyonu oluşturduk
    if(e.target.className==="fa fa-remove"){ //eğer tıklanan objenin class'ı fa fa-remove ise 
        const todo = e.target.parentElement.parentElement; // hedef objenin 2 parent elementine git
        todo.remove(); //ve o elementi ekrandan sil
        removeTodoToStorage(todo.textContent); //çarpıya tıklandığında bu fonksiyonu da çalıştır
        showAlert("success","Etkinlik başarıyla kaldırıldı")
    }
}

function removeTodoToStorage(removeTodo){  //
    checkTodosFromStorage(); //storage'ı kontrol et
    todos.forEach(function(todo,index){ // array'lerin her birinin ismini ve index değerini bul
        if(todo==removeTodo){ //eğer benim silmek istediğim değerin ismi array içinde varsa
            todos.splice(index,1); //index değerine git ve (1) sadece onu sil.
        }
    
    })
    localStorage.setItem("todos",JSON.stringify(todos)); 
}
function addTodo(e){
    e.preventDefault(); //Farklı bir sayfaya yönlendirmesini engelliyoruz.
    console.log("submit eventi çalıştı")
    const inputText = addInput.value.trim(); //Input içerisine girilen değerin sağında solunda boşluk olmayacak şekilde ayarla
    if(inputText==null || inputText==""){ //Eğer inputa girilen değer null ise veya boş ise 
        showAlert("warning", "Lütfen geçerli bir değer giriniz");
    }else{
        //Arayüze Ekleme
        addTodoToUI(inputText)
        //Storage Ekleme
        addTodoToStorage(inputText);
        //Uyarı ekleme 
        showAlert("success","Göreviniz Eklendi")

    }
    
}

function addTodoToUI(newTodo){ //Arayüze eklemek için fonksiyon oluşturduk
const li = document.createElement("li"); //li elementi oluşturduk
li.className="list-group-item d-flex justify-content-between "; //li elementine stil verdik
li.textContent=newTodo; //listenin içine yazılan değeri inputText'e eşitledik . 

const a = document.createElement("a"); //çarpı işaretini koymak için a öğesi ekledik
a.href="#";
a.className="delete-item"

const i = document.createElement("i"); //çarpı işaretini koyduk
i.className="fa fa-remove"

a.appendChild(i); //çarpı işaretini a kutusunun içine ekledik

li.appendChild(a); //a kutusunu liste öğesininin içine ekledik

todoList.appendChild(li); //liste öğesini ul'nin içie ekledik
addInput.value="";
}
function addTodoToStorage(newTodo) {//Storage'a eklemek için fonksiyon oluşturduk.
    checkTodosFromStorage();//storage'ı kontrol et
    todos.push(newTodo); //yeni oluşan todo bilgisini todos içerisine ekle
    localStorage.setItem("todos",JSON.stringify(todos)); //eklenen bilgiyle beraber set edelim
}

function checkTodosFromStorage(){ //Storage için kontrol mekanizması yazdık 
    if (localStorage.getItem("todos") === null) { //eğer storage'ın içinde todos id'sinde değer yoksa
        todos = []; //oluştur
    }else{ //varsa
        todos=JSON.parse(localStorage.getItem("todos")); //orda bulunan todos'u array'e çevirmiş şekilde bana ver
    }
}

function showAlert(type,message){  //Alarmlar için fonksiyon oluşturduk
    const div = document.createElement("div"); //yeni bir div oluşturduk
   div.className = "alert alert-" + type ; //farklı class'lar için kullanılabilir hale getirdik
   div.textContent = message; //Mesaj parametresini ayarladık
   firstCardBody.appendChild(div); //FirstCardBody elementinin altına ekledik
   setTimeout(function(){ //1 saniye sonra div'i silmek için setTimeout fonksiyonu çalıştırıldı
       div.remove(); //div'i silmek için remove() fonksiyonu çalıştırıldı
   },2000); //2 saniye süre verildi
}