if(localStorage.getItem("key")){
if (localStorage.getItem("user")) {
    notifications.children[1].addEventListener('click', () => {
        localStorage.removeItem("user");
        window.location.reload();
    });

    mainName.textContent = localStorage.getItem("user");
    const headers = {
        "Authorization":localStorage.getItem("key"),
        "Content-Type": "application/json"
    };
    (async () => await fetch(`https://api.airtable.com/v0/appkU9GsZeL8KEbaH/Main?filterByFormula=${encodeURIComponent(`Name="${localStorage.getItem("user")}"`)}`, { headers }).then(res => res.json()).then(r => r.records[0] ? r.records[0].fields.Geslacht : "url(vrouw.jpg)").then(z => portret.style.backgroundImage = z === "M" ? `url(man.jpg)` : `url(vrouw.jpg)`))();
    ["portret", "mad"].forEach((x, i) => document.querySelectorAll(".contactPic")[i].style.backgroundImage = `url(${x}.jpg)`)
    const base = "https://api.airtable.com/v0/appL2uAgaQYX4vctm/Message";
    const url = q => base + `?filterByFormula=${encodeURIComponent(q)}`;

    const request = (...args) => fetch(...args).then(res => res.json());
    const get = q => request(url(q), { headers }).then(r => r.records);
    const post = (To, From, Subject, Message) => request(base, { method: "POST", headers, body: JSON.stringify({ records: [{ fields: { To, From, Subject, Message } }] }) })
    const getMessages = (To, Archived) => get(`AND(To="${To}",Archived=${Archived})`).then(res => {
        localStorage.setItem("messages", JSON.stringify(res));
        messageView.innerHTML = res.map(rec => `<div class="message"><div class="icon"><div class="iconContent"></div></div><div class="messageText"><div>${rec.fields.Subject}</div><div>${rec.fields.From}</div></div><div class="createdTime">${new Date(rec.fields.Created).toString().split("GMT")[0]}</div></div>`).join('');
        document.querySelectorAll(".message").forEach((mess, i) => {

            mess.addEventListener("click", async (ev) => {
                messageContent.style.display = "block";
                messageMenu.style.display = "grid";
                messageContent.textContent = res[i].fields.Message;
                messageMenu.children[1].addEventListener("click", async () => {
                    await request(base, { method: "PATCH", headers, body: JSON.stringify({ records: [{ id: res[i].id, fields: { Archived: true } }] }) })
                        .then(r => {
                            mess.style.display = "none";
                            messageContent.textContent = "";
                            messageMenu.style.display = "none";
                        });

                })
                messageMenu.children[0].addEventListener("click", async (e) => {
                    if (e.target.textContent === "reply") {

                        messageContent.innerHTML = `<textarea></textarea>`;
                        setTimeout(() => e.target.textContent = "send", 1);
                    } else {

                        await post(res[i].fields.From, res[i].fields.To, res[i].fields.Subject, document.querySelector("textarea").value).then(res => {
                            setTimeout(() => messageMenu.children[0].textContent = "reply", 1);
                            messageContent.innerHTML = `<span class="material-symbols-outlined" id="temp"></span>`
                            messageMenu.style.display = "none";
                            temp.style.fontSize = "70px";
                            messageContent.style.height = "100%";
                            messageContent.style.display = "flex";
                            messageContent.style.placeItems = "center";
                            messageContent.style.placeContent = "center";
                            if (res.records) {
                                temp.textContent = "task_alt";
                                temp.style.color = "green";

                            } else {

                                temp.textContent = "error";
                                temp.style.color = "red";
                            };
                        })
                    };








                });
            })
        })

    });

    const med = {"Enhertu":"borstkanker","Brukinsa":"lymfeklierkanker","Nubeqa":"prostaatkanker"};

    const setDashboard = () => {
        document.querySelector("date-time").textContent = `${new Date().getDay()}-${new Date().getMonth()}-${new Date().getFullYear()}`;
        const addItem = (i = 0) => {
            if (i < 7) {
                agendaItems.innerHTML += `<div class="agendaItem">${new Date().getHours() + i}`;
                addItem(i + 1);
            }
        };


        tc.style.width = '50%';
        tc.style.aspectRatio = '1/1';
        tc.style.borderRadius = '50%';
        tc.style.background = `repeating-conic-gradient(
    transparent 0,
    transparent 10%,
    hotpink 0%,
    hotpink 20%,
    yellow 0,
    yellow 30%,
    hsla(200,100%,50%) 0,
    hsla(200,100%,50%) 40%

)`;
        tc.style.backgroundSize = '30px 30px';



        bc.style.width = '50%';
        bc.style.aspectRatio = '1/1';
        bc.style.borderRadius = '50%';
        bc.style.background = `repeating-conic-gradient(
    transparent 0,
    transparent 10%,
    red 0%,
    red 20%,
    yellow 0,
    yellow 30%,
    hsla(200,100%,50%) 0,
    hsla(200,100%,50%) 40%

)`;

        bc.style.backgroundSize = '30px 30px';


        addItem();
    };
    let sendMessage = () => {

        if (window.getComputedStyle(messageMenu).display === "none") {
            messageContent.style.display = "grid";
            messageContent.style.grid = `50px 50px 1fr 50px / 100%`;

            messageContent.innerHTML = `<input id="sendTo"><input><textarea></textarea><div id="sendNew">Send</div>`;
            sendNew.addEventListener("click", async () => await post(messageContent.children[0].value, localStorage.getItem("user"), messageContent.children[1].value, messageContent.children[2].value)
                .then(res => {
                    messageContent.innerHTML = `<span class="material-symbols-outlined" id="temp"></span>`
                    messageMenu.style.display = "none";
                    temp.style.fontSize = "70px";
                    messageContent.style.height = "100%";
                    messageContent.style.display = "flex";
                    messageContent.style.placeItems = "center";
                    messageContent.style.placeContent = "center";
                    if (res.records) {
                        temp.textContent = "task_alt";
                        temp.style.color = "green";

                    } else {

                        temp.textContent = "error";
                        temp.style.color = "red";
                    }
                }))

        };

    };

    const setInbox = async () => {
        messageContent.addEventListener("click", () => {
            if (window.getComputedStyle(messageMenu).display === "none" && !document.querySelector("#sendTo")) {
                sendMessage();

            }

        });

        await getMessages(localStorage.getItem("user"), 0)

    }
    document.querySelectorAll(".menu").forEach(m => m.addEventListener("click", (e) => {
        document.querySelectorAll(".menu").forEach(l => l.style.background = "");
        m.style.background = "hsla(0,100%,50%,0.7)";






        const data = {
            Dashboard: {
                html:
                    `<div id="dashboardData">
    <div id="dashboardName">Dashboard</div>
    <div class="dashboardItem">
        <div class="dashboardItemName"></div>
        <div class="dashboardItemContent">
            <div class="circle" id="circleA"> <span class="material-symbols-outlined" id="book">menu_book</span><div id="number">33</div> <div>Ubla kie</div></div>
        </div>
    </div>
    <div class="dashboardItem">
        <div class="dashboardItemName"></div>
        <div class="dashboardItemContent">
            
                <div class="circle" id="circleB"> <span class="material-symbols-outlined" id="book">menu_book</span><div id="number">33</div> <div>Ubla kie</div></div>
          
        </div>
    </div>
    <div class="dashboardItem">
        <div class="dashboardItemName"></div>
        <div class="dashboardItemContent">
         
                <div class="circle" id="circleC"> <span class="material-symbols-outlined" id="book">menu_book</span><div id="number">33</div> <div>Ubla kie</div></div>
        
        </div>
    </div>
    <div class="dashboardItem">
        <div class="dashboardItemName"></div>
        <div class="dashboardItemContent">
           
                <div class="circle" id="circleD"> <span class="material-symbols-outlined" id="book">menu_book</span><div id="number">33</div> <div>Ubla kie</div></div>
               
         
        </div>
    </div>
</div>
<div class="dashboardExtra">
    <div class="calculations"><div id="tc"></div>
<div id="bc"></div></div>
    <div class="agenda">
        <div class="agendaName"><div>Agenda</div><date-time></date-time></div>
        <div id="agendaItems">
        
        </div>
    </div>
</div>
</div>

`,
                func: setDashboard
            },
            Berichten: {
                html: `<div id="inbox"><div id="inboxName">Inbox</div><div id="messageView"></div></div><div id="readMessage"><div id="messageContent">New Message</div><div id="messageMenu"><div class="messageMenu">reply</div><div class="messageMenu">archive</div></div></div>`,
                func: setInbox
            },
            Medicijnen:{
                html:`<div id="medicijnen">${Object.keys(med).map((x,i) => `<div class="medicijn"><div class="status"><span class="material-symbols-outlined medicijnStatus">${i===1?'verified':'lock'}</span></div><div class="medicijnNaam"><div>${x}</div><div class="indicatie">${med[x]}</div></div><div class="fda"><div>FDA</div><div>10-10-2020</div></div><div class="ema"><div>EMA</div><div>20-20-2022</div></div><div><span class="material-symbols-outlined medicijnStatus"><a href="https://www.ema.europa.eu/en/documents/overview/${x}-epar-medicine-overview_nl.pdf">link</a></span></div></div>`).join("")}</div>`,
                func:()=>{
                  
                    const all = Object.values(medicijnen.children);
                    searchInput.addEventListener("input",()=>{
                    
                    medicijnen.innerHTML = all.filter(x => x.children[1].textContent.toLowerCase().split(searchInput.value.toLowerCase()).length > 1).map(z => z.outerHTML).join("")
                })
            }}
        };
        const key = m.children[1].textContent;
        if (data[key]) {
            dashboard.innerHTML = data[key].html;
            data[key].func();
            dashboard.style = "initial";
        } else {
            dashboard.innerHTML = `<div class="empty"></div>`;
            dashboard.style.display = 'flex';
            dashboard.style.placeItems = "center";
            dashboard.style.placeContent = "center";
        }

    }))
} else {
   
    const setBody =()=>{
        document.body.style.background = `repeating-conic-gradient(
        hsla(323,100%,50%,0.7) 0,
        hsl(323,100%,50%,0.7) 10%,
        hsl(203,100%,50%,0.7) 0,
        hsl(203,100%,50%,0.7) 20%,
        hsl(103,100%,50%,0.7) 0,
        hsl(103,100%,50%,0.7) 30%,
        hsla(323,100%,50%,0.7) 0,
        hsl(323,100%,50%,0.7) 40%,
        hsl(203,100%,50%,0.7) 0,
        hsl(203,100%,50%,0.7) 50%,
        hsl(103,100%,50%,0.7) 0,
        hsl(103,100%,50%,0.7) 60%

),repeating-radial-gradient(
    hsla(323,100%,50%,0.5) 0,
    hsl(323,100%,50%,0.5) 10%,
    hsl(203,100%,50%,0.5) 0,
    hsl(203,100%,50%,0.5) 20%,
    hsl(103,100%,50%,0.5) 0,
    hsl(103,100%,50%,0.5) 30%

)`;
    document.body.style.backgroundBlendMode = 'screen';
    document.body.style.backgroundSize =  `${window.innerWidth / 10}px ${window.innerWidth / 10}px`;
    document.body.style.clipPath = `ellipse(40vh 40vh)`;
    document.body.innerHTML = `<input class="ll"><div id="send">Send</div>`;
    
 
    send.style.width = '100%';
    send.style.height = '20%';
    send.style.position = 'fixed';
    send.style.bottom = '10%';

    send.style.color = 'hotpink';
    send.style.fontFamily = 'Bebas Neue';
    send.style.display = "flex";
    send.style.placeContent='center';
    send.style.placeItems = 'center';
    send.style.fontSize = '3rem';

    send.style.background = 'black';
    send.addEventListener("click", () => {
        if(document.querySelector("input").value){
        localStorage.setItem("user", document.querySelector("input").value);
        window.location.reload();
        } else {
           
            document.body.style.background = "red";
            send.textContent = "Give A NAME";
            send.style.color = 'red'; 
            setTimeout(()=>setBody(),1000); 
        }
    });
};
setBody(); 
  

}
} else {
    document.body.style.background = `repeating-conic-gradient(
        hsla(323,100%,50%,0.7) 0,
        hsl(323,100%,50%,0.7) 10%,
        hsl(203,100%,50%,0.7) 0,
        hsl(203,100%,50%,0.7) 20%,
        hsl(103,100%,50%,0.7) 0,
        hsl(103,100%,50%,0.7) 30%,
        hsla(323,100%,50%,0.7) 0,
        hsl(323,100%,50%,0.7) 40%,
        hsl(203,100%,50%,0.7) 0,
        hsl(203,100%,50%,0.7) 50%,
        hsl(103,100%,50%,0.7) 0,
        hsl(103,100%,50%,0.7) 60%

),repeating-radial-gradient(
    hsla(323,100%,50%,0.5) 0,
    hsl(323,100%,50%,0.5) 10%,
    hsl(203,100%,50%,0.5) 0,
    hsl(203,100%,50%,0.5) 20%,
    hsl(103,100%,50%,0.5) 0,
    hsl(103,100%,50%,0.5) 30%

)`;
    document.body.style.backgroundBlendMode = 'screen';
    document.body.style.backgroundSize =  `${window.innerWidth / 10}px ${window.innerWidth / 10}px`;
    document.body.style.clipPath = `ellipse(40vh 40vh)`;
    document.body.innerHTML = `<input class="ll"><div id="send">Send</div>`;

 
    send.style.width = '100%';
    send.style.height = '20%';
    send.style.position = 'fixed';
    send.style.bottom = '10%';

    send.style.color = 'hotpink';
    send.style.fontFamily = 'Bebas Neue';
    send.style.display = "flex";
    send.style.placeContent='center';
    send.style.placeItems = 'center';
    send.style.fontSize = '3rem';

    send.style.background = 'black';

        
    send.addEventListener("click", () => {
        localStorage.setItem("key", document.querySelector("input").value);
        window.location.reload();
    });

}