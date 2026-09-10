'use client';
import {Check} from 'lucide-react';
import {radius,packBubbles, type BubbleNode} from './bubble-layout';
import {useState,useRef,useEffect,CSSProperties,useMemo} from 'react';
import {getRoots,type Audience,type StoryFormat} from './story-data';
type Node=BubbleNode;
export default function BubbleGarden({audience,format,onChange}:{audience:Audience;format:StoryFormat;onChange:(labels:string[])=>void}){
 const data=useMemo(()=>getRoots(audience,format),[audience,format]);
 const makeRoots=()=>packBubbles(data.map((item,i)=>({id:item.label,label:item.label,level:0,x:480+Math.cos(i*2.39996)*Math.sqrt(i)*40,y:430+Math.sin(i*2.39996)*Math.sqrt(i)*40,px:480,py:430})));
 const[nodes,setNodes]=useState<Node[]>(makeRoots),[selected,setSelected]=useState<string[]>([]);const viewport=useRef<HTMLDivElement>(null);
 useEffect(()=>{setNodes(makeRoots());setSelected([]);onChange([]);const el=viewport.current;if(el){el.scrollLeft=480-el.clientWidth/2;el.scrollTop=430-el.clientHeight/2}},[data]);
 function pick(n:Node){
  const next=selected.includes(n.id)?selected.filter(x=>x!==n.id):[...selected,n.id];setSelected(next);onChange(nodes.filter(x=>next.includes(x.id)).map(x=>x.label));
  if(selected.includes(n.id)||n.level===2||nodes.some(x=>x.id.startsWith(n.id+'/')))return;
  const root=data.find(x=>x.label===(n.level===0?n.label:n.id.split('/')[0]));
  const labels=n.level===0?Object.keys(root?.children||{}):(root?.children[n.label]||[]);
  const direction=Math.atan2(n.y-430,n.x-480);setNodes(old=>packBubbles([...old,...labels.map((label,i)=>{const angle=direction+(i-(labels.length-1)/2)*1.05;return{id:n.id+'/'+label,parent:n.id,label,level:n.level+1,x:n.x+Math.cos(angle)*72,y:n.y+Math.sin(angle)*72,px:n.x,py:n.y}})]));
 }

return <div className="water-viewport" ref={viewport}><div className="water-world"><div className="water-glow"/>{nodes.map(n=><button key={n.id} aria-pressed={selected.includes(n.id)} className={`water-orb level-${n.level} ${selected.includes(n.id)?'picked':''}`} style={{left:n.x,top:n.y,width:radius(n)*2,height:radius(n)*2,margin:-radius(n),'--birth-x':`${n.px-n.x}px`,'--birth-y':`${n.py-n.y}px`} as CSSProperties} onClick={()=>pick(n)}><span>{n.label}</span>{selected.includes(n.id)&&<i className="orb-check" aria-hidden="true"><Check/></i>}</button>)}</div></div>}
