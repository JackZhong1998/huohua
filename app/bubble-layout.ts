export type BubbleNode={id:string,label:string,level:number,x:number,y:number,px:number,py:number,parent?:string};
export const radius=(node:BubbleNode)=>{const hash=Array.from(node.id).reduce((h,c)=>(h*31+c.charCodeAt(0))>>>0,7);const sizes=node.level===0?[30,36,43,48]:node.level===1?[28,33,39,44]:[27,31,36,40];return sizes[hash%4]};
/** Compact parent attraction followed by hard collision projection. */
export function packBubbles(input:BubbleNode[]):BubbleNode[]{
 const nodes=input.map(n=>({...n}));const byId=new Map(nodes.map(n=>[n.id,n]));
 for(let step=0;step<240;step++){
  if(step<170)for(const n of nodes){const p=n.parent?byId.get(n.parent):undefined;const tx=p?.x??480,ty=p?.y??430;const dx=tx-n.x,dy=ty-n.y,d=Math.hypot(dx,dy);const target=p?radius(n)+radius(p)+8:0;const force=p?.035:.009;if(d>target){n.x+=dx*force;n.y+=dy*force}}
  for(let i=0;i<nodes.length;i++)for(let j=i+1;j<nodes.length;j++){const a=nodes[i],b=nodes[j];let dx=b.x-a.x,dy=b.y-a.y,d=Math.hypot(dx,dy);if(d<.001){dx=Math.cos(i+j);dy=Math.sin(i+j);d=1}const min=radius(a)+radius(b)+9;if(d<min){const push=(min-d)/2+.001;a.x-=dx/d*push;a.y-=dy/d*push;b.x+=dx/d*push;b.y+=dy/d*push}}
 }
 return nodes;
}
