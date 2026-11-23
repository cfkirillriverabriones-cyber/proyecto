import React, { useEffect, useState } from 'react';
import { BarChart3, Boxes, ChevronDown, ClipboardList, FileText, LayoutDashboard, Search, Settings, ShoppingCart, Truck, UserRound, Wrench } from 'lucide-react';

type Item = { id:string; name:string; sku:string; stock:number; minimum:number; price:number; category:string };
const seed: Item[]=[
 {id:'1',name:'Laptop Dell Latitude',sku:'DELL-5400',stock:24,minimum:8,price:899,category:'Portátiles'},
 {id:'2',name:'Monitor LG 27 pulgadas',sku:'LG-27Q',stock:18,minimum:6,price:279,category:'Pantallas'},
 {id:'3',name:'SSD NVMe 1TB',sku:'SSD-1TB',stock:7,minimum:12,price:89,category:'Almacenamiento'},
 {id:'4',name:'Router empresarial',sku:'RTR-AX3000',stock:32,minimum:10,price:149,category:'Redes'},
 {id:'5',name:'Teclado mecánico',sku:'TEC-MX',stock:45,minimum:15,price:59,category:'Periféricos'},
];

const format=(n:number)=>new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(n);

export default function App(){
 const [items,setItems]=useState<Item[]>(()=>{try{return JSON.parse(localStorage.getItem('nzxt-inventory')||'null')||seed}catch{return seed}});
 const [active,setActive]=useState('Dashboard');
 const [search,setSearch]=useState('');
 const [showModal,setShowModal]=useState(false);
 useEffect(()=>localStorage.setItem('nzxt-inventory',JSON.stringify(items)),[items]);
 const menus=[['Dashboard',LayoutDashboard],['Inventario',Boxes],['Compras',ShoppingCart],['Ventas',ClipboardList],['Transportes',Truck],['Soporte',Wrench],['Reportes',BarChart3],['Configuración',Settings]] as const;
 const visible=items.filter(i=>`${i.name} ${i.sku}`.toLowerCase().includes(search.toLowerCase()));
 const low=items.filter(i=>i.stock<=i.minimum).length;
 const value=items.reduce((a,i)=>a+i.stock*i.price,0);

 const add=(e:React.FormEvent<HTMLFormElement>)=>{e.prevent();const f=new FormData(e.currentTarget);setItems(x=>[...x,{id:crypto.randomUUID(),name:String(f.get('name')),sku:String(f.get('sku')),stock:Number(f.get('stock')),minimum:Number(f.get('minimum')),price:Number(f.get('price')),category:String(f.get('category'))}]);setShowModal(false)};

 return <div className="app"><aside>
  <div className="brand"><span className="logo">N</span><div><strong>NZXT</strong><small>LOGÍSTICA</small></div></div>
  <nav>{menus.map(([name,Icon])=><button key={name} className={active===name?'active':''} onClick={()=>setActive(name)}><Icon size={19}/><span>{name}</span></button>)}</nav>
  <div className="user"><div className="avatar"><UserRound size={18}/></div><div><strong>Administrador</strong><small>Cuenta principal</small></div><ChevronDown size={15}/></div>
 </aside>
 <main><header><div><h1>{active}</h1><p>Centro integral de operaciones NZXT</p></div><div className="tools"><label><Search size={17}/><input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/></label><button className="primary" onClick={()=>setShowModal(true)}>Nuevo producto</button></div></header>
 {active==='Dashboard'||active==='Inventario'?<>
  {active==='Dashboard'&&<section className="cards"><Card title="Valor del inventario" value={format(value)} detail="Valor actual estimado"/> <Card title="Productos" value={String(items.length)} detail="Referencias registradas"/> <Card title="Stock bajo" value={String(low)} detail="Requieren reposición" warning/> <Card title="Órdenes activas" value="12" detail="7 pendientes de envío"/></section>}
  <section className="panel"><div className="panel-head"><div><h2>Inventario</h2><p>Productos y disponibilidad actual</p></div><button className="secondary"><FileText size={16}/> Exportar</button></div>
  <table><thead><tr><th>Producto</th><th>SKU</th><th>Categoría</th><th>Stock</th><th>Estado</th><th>Precio</th></tr></thead><tbody>{visible.map(i=><tr key={i.id}><td><div className="product"><span>{i.name.charAt(0)}</span><strong>{i.name}</strong></div></td><td>{i.sku}</td><td>{i.category}</td><td><strong>{i.stock}</strong> uds.</td><td><span className={i.stock<=i.minimum?'badge danger':'badge'}>{i.stock<=i.minimum?'Reponer':'Disponible'}</span></td><td>{format(i.price)}</td></tr>)}</tbody></table></section>
 </>:<section className="panel placeholder"><Boxes size={44}/><h2>{active}</h2><p>Este módulo está preparado para ampliarse dentro del sistema.</p></section>}
 </main>{showModal&&<div className="overlay"><form className="modal" onSubmit={add}><h2>Nuevo producto</h2><div className="form-grid"><label>Nombre<input name="name" required/></label><label>SKU<input name="sku" required/></label><label>Categoría<input name="category" required/></label><label>Stock<input name="stock" type="number" min="0" required/></label><label>Mínimo<input name="minimum" type="number" min="0" required/></label><label>Precio<input name="price" type="number" min="0" step="0.01" required/></label></div><div className="modal-actions"><button type="button" className="secondary" onClick={()=>setShowModal(false)}>Cancelar</button><button className="primary">Guardar</button></div></form></div>}</div>
}
function Card({title,value,detail,warning=false}:{title:string,value:string,detail:string,warning?:boolean}){return <article className="card"><p>{title}</p><strong className={warning?'warning':''}>{value}</strong><small>{detail}</small></article>}
