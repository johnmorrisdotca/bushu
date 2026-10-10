import { VERSION } from "./dist/index.js";
import { BushuPicker, BUSHU_EMBED_OPTION_KEYS } from "./dist/element.js";
import "./dist/element-define.js";
import { familyEmbedBuilder, FAMILY_EMBED_BUILDER_WORDS } from "./family-embed-builder.js";
const words={en:{...FAMILY_EMBED_BUILDER_WORDS.en,pitch:"Choose radicals and a starting kanji, preview the picker and copy its embed code.",name:"Bushu means kanji radical in Japanese.",nameLink:"About the name",foot:"The setup is in the link. No lookup or personal data is stored.",toGallery:"The radical picker",makerPicker:"A radical picker",makerPickerSays:"Find kanji by choosing the parts they contain.",copyLink:"Copy a link to this picker"},ja:{...FAMILY_EMBED_BUILDER_WORDS.ja,pitch:"部首と最初に表示する漢字を選び、プレビューを確認して、ページに埋め込むコードをコピーできます。",name:"「部首」は漢字を分類する部分です。",nameLink:"名前について",foot:"設定はリンクに入ります。検索や個人情報は保存しません。",toGallery:"部首の一覧",makerPicker:"部首を選ぶ",makerPickerSays:"含まれる部品を選んで漢字を探します。",copyLink:"この部首選択へのリンクをコピー"}};
const row=(id,kind,en,ja,extra={})=>({id,kind,group:"picker",names:{picker:id,mount:({parts:"chosen",lang:"language"}[id]??id)},say:{en:{label:en[0],help:en[1]},ja:{label:ja[0],help:ja[1]}},...extra});
const options=[
row("parts","text",["Radicals","Shapes or RADKFILE keys, with or without spaces."],["部首","見た目の形、またはRADKFILEの文字で指定します。空白は任意です。"]),
row("kanji","text",["Starting kanji","Open this kanji's card."],["最初の漢字","この漢字のカードを開きます。"]),
row("limit","number",["Result limit","The most kanji shown at once."],["表示する上限","一度に表示する漢字の数です。"],{default:120,range:{min:1,max:500,step:1}}),
row("size","choice",["Display size","Small, medium or large."],["表示の大きさ","小・中・大を選びます。"],{default:"medium",choices:["small","medium","large"]}),
row("width","number",["Width","Pixels, fitting a narrower parent."],["幅","ピクセルで指定します。狭い表示枠にも収まります。"],{range:{min:200,max:1000,step:10}}),
row("theme","choice",["Theme","Light, dark or the device's preference."],["配色","明るい配色・暗い配色、または端末の設定に合わせます。"],{default:"auto",choices:["auto","light","dark"]}),
row("lang","choice",["Language","Controls and spoken kanji."],["読み上げる言語","操作ボタンと漢字の読み上げに使います。"],{choices:["en","ja"]}),
row("label","text",["Spoken label","An optional screen-reader label."],["読み上げる名前","スクリーンリーダー用の名前です。指定は任意です。"]),
];
const leftOut={};for(const name of["radicals","names","strokes"])leftOut[`mount.${name}`]="The element loads the bundled data; host code can replace it through options.";for(const name of["onChange","onPick"])leftOut[`mount.${name}`]="Callbacks belong to host options; native events carry the same detail.";
let mounted;const page=globalThis.familyLanguage({id:"bushu",words,onChange:()=>mounted?.draw()}),heights={};const key=settings=>JSON.stringify(settings);
const builder=familyEmbedBuilder({id:"bushu",packageName:"@johnmorrisdotca/bushu",major:VERSION.split(".")[0],site:"https://johnmorrisdotca.github.io/bushu/",title:"Bushu · radical picker",titleJa:"部首選択の埋め込み",options,leftOut,groups:{picker:{en:"The picker",ja:"部首選択の設定"}},makers:{picker:{names:"picker",element:"picker",tag:"bushu-picker",embed:"embed/",required:["size"],description:"makerPickerSays",formats:["element","iframe","module","react","vue","svelte","angular","html","url"],width:640,height:settings=>heights[key(settings)]??1400}},code:({maker,format,settings})=>{if((format==="iframe"||format==="url")&&settings.lang===undefined)return builder.codeFor(maker,format,options,{...settings,lang:page.lang});return undefined;}});
builder.validateCoverage({picker:BushuPicker.observedAttributes,mount:BUSHU_EMBED_OPTION_KEYS});
mounted=builder.mount({words,language:()=>page,initial:{picker:{size:"medium",lang:page.lang}},renderPreview:({stage,attrs,settings})=>{const picker=globalThis.document.createElement("bushu-picker");for(const[name,value]of attrs)picker.setAttribute(name,value);picker.addEventListener("bushu-load",()=>{heights[key(settings)]=Math.ceil(picker.getBoundingClientRect().height)+100;mounted?.refreshCode();});stage.append(picker);return{destroy(){picker.remove();}};}});
