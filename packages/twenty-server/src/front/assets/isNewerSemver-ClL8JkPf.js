const o=(s,a)=>{const n=s.split(".").map(Number),i=a.split(".").map(Number);for(let r=0;r<3;r++){const t=n[r]??0,e=i[r]??0;if(t>e)return!0;if(t<e)return!1}return!1};export{o as i};
