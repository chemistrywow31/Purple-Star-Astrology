'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ArrowDown, ArrowRight, Check, ChevronDown, CircleHelp, Compass, Eye,
  GraduationCap, Layers3, Search, ShieldCheck, Sparkles, Star, X,
} from 'lucide-react';

const stages = [
  ['foundation', '01', '先建立閱讀地圖', '學習邊界、命盤骨架與判讀順序。', '約 35 分鐘'],
  ['stars', '02', '辨認十四主星', '把星曜當角色線索，不當成人生判決。', '約 70 分鐘'],
  ['pairs', '03', '讀懂雙星語句', '學會兩個線索如何互相修飾。', '約 60 分鐘'],
  ['support', '04', '加入輔星與雜曜', '看懂加強、轉折與情境條件。', '約 55 分鐘'],
  ['transform', '05', '掌握四化流動', '用祿、權、科、忌標記閱讀重點。', '約 45 分鐘'],
  ['stems', '06', '十天干四化查表', '分清課程版本與不能硬判的地方。', '約 50 分鐘'],
  ['palaces', '07', '回到十二宮位', '把星曜放進不同人生議題。', '約 70 分鐘'],
  ['practice', '08', '練習與證據檢核', '用工作紙把問題、證據與限制分開。', '約 40 分鐘'],
] as const;

const starCards = [
  ['紫微', '組織與主導', '像安排全隊任務的隊長；仍要看位置與其他星曜。', '穩定型'],
  ['天府', '資源與穩定', '像管理物資與節奏的管家；不是保證有錢。', '穩定型'],
  ['天機', '策略與調整', '像會換路線的策畫者；思考多不等於答案一定對。', '思考型'],
  ['太陰', '累積與內在', '像慢慢整理筆記的人；不是單純的好或壞。', '思考型'],
  ['天同', '感受與協調', '像重視舒服合作的同學；仍需放進情境判讀。', '關係型'],
  ['天梁', '照顧與原則', '像願意撐住規則的人；不是萬能保護罩。', '關係型'],
  ['七殺', '行動與承擔', '像面對難題敢先動手的人；不等於衝動一定好。', '行動型'],
  ['破軍', '改變與重整', '像把舊做法拆開重組；改變也會帶來成本。', '行動型'],
  ['貪狼', '才藝與吸引', '像對新鮮事很有感的人；興趣不等於命定結果。', '關係型'],
  ['廉貞', '規則與界線', '像在意原則與價值的人；需要結合全盤語境。', '思考型'],
  ['天相', '協調與角色', '像懂得在團隊裡接住彼此的人；不能脫離位置解讀。', '關係型'],
  ['太陽', '投入與可見度', '像願意把能量放到外面的人；亮暗是條件，不是價值評分。', '行動型'],
  ['武曲', '執行與效率', '像把計畫做成清單的人；資源題不等於投資建議。', '行動型'],
  ['巨門', '觀察與表達', '像會追問細節的人；提問不等於是非注定。', '思考型'],
] as const;

const transformations = [
  ['祿', '把注意力放在增加與連結', '課程裡可把它當成「哪裡容易被加重」的閱讀標記。', 'gold'],
  ['權', '把注意力放在角色與承擔', '它提醒你觀察主動性、責任或推動力的線索。', 'coral'],
  ['科', '把注意力放在可見度與學習', '它提醒你觀察名聲、表現或被看見的條件。', 'sky'],
  ['忌', '把注意力放在壓力與回應', '它是需要多看條件的提醒，不是「一定倒楣」的標籤。', 'ink'],
] as const;

const tenStems = [
  ['甲', '廉貞祿', '破軍權', '武曲科', '太陽忌'], ['乙', '天機祿', '天梁權', '紫微科', '太陰忌'],
  ['丙', '天同祿', '天機權', '文昌科', '廉貞忌'], ['丁', '太陰祿', '天同權', '天機科', '巨門忌'],
  ['戊', '貪狼祿', '太陰權', '右弼科', '天機忌'], ['己', '武曲祿', '貪狼權', '天梁科', '文曲忌'],
  ['庚 A', '太陽祿', '武曲權', '太陰科', '天同忌'], ['庚 B', '太陽祿', '武曲權', '天同科', '天相忌'],
  ['辛', '巨門祿', '太陽權', '文曲科', '文昌忌'], ['壬', '天梁祿', '紫微權', '左輔科', '武曲忌'],
  ['癸', '破軍祿', '巨門權', '太陰科', '貪狼忌'],
] as const;

const palaces = [
  ['命宮', '自我觀察的起點'], ['兄弟宮', '手足與合作語境'], ['夫妻宮', '關係與時間層次'],
  ['子女宮', '子女、學生與創作語境'], ['財帛宮', '現金與理財語境'], ['疾厄宮', '傳統身體類像與就醫邊界'],
  ['遷移宮', '外在環境與遠方'], ['交友宮', '朋友、部屬與工具'], ['官祿宮', '工作形式與角色'],
  ['田宅宮', '資產與家庭基底'], ['福德宮', '精神享受與來源'], ['父母宮', '長輩、主管與機構'],
] as const;

const glossary = [
  ['命盤', '把宮位與星曜放在同一張結構圖中閱讀的框架。'], ['主星', '十四個主要角色線索；先理解單星，再看組合。'],
  ['雙星', '兩顆主星共處時的閱讀語句，不是數學公式。'], ['四化', '祿、權、科、忌四種課內閱讀標記。'],
  ['天干', '甲到癸的十個符號；本課用它們查四化表。'], ['十二宮位', '十二個人生議題的觀察位置，不是十二種人生保證。'],
  ['身宮', '課程中的另一個觀察位置，依時辰有六種落點。'], ['三方四正', '把本宮與相關位置一起看的結構方法。'],
  ['空宮借對宮', '課程中的閱讀方法；不是把對宮內容整段搬過來。'], ['暗合', '本課以六合對照呈現的關係線索，不能單獨推成事件。'],
] as const;

const quizzes = [
  ['第一次讀一個宮位時，最合適的起手式是？', ['直接判斷吉凶', '先確認它在談哪個人生議題，再看星曜與條件', '只背主星口訣'], 1, '正確。先定位問題，再看角色與關係，才能避免把一個線索當成結論。'],
  ['遇到庚天干四化時，這門課採取什麼做法？', ['只保留一種唯一答案', '並列 A、B 兩種來源版本', '不需要標示來源'], 1, '正確。課程把 A／B 並列，不能假裝衝突不存在。'],
  ['雙星組合最適合被理解成什麼？', ['兩個角色線索互相修飾的句子', '固定等號公式', '對真實人物的預言'], 0, '正確。它是條件化的閱讀語句，不是公式，更不是對人的判決。'],
] as const;

function PalaceWheel({ selected, onSelect }: { selected: string; onSelect: (value: string) => void }) {
  const detail = palaces.find(([name]) => name === selected)?.[1] ?? '';
  return <div className="palace-wheel-wrap">
    <div className="palace-wheel" aria-label="十二宮位互動圖">
      <div className="wheel-center"><Compass size={26} /><span>從問題<br />開始看</span></div>
      {palaces.map(([name], index) => {
        const angle = (index * 30 - 90) * (Math.PI / 180);
        return <button key={name} type="button" className={`palace-node ${selected === name ? 'is-active' : ''}`} onClick={() => onSelect(name)} aria-pressed={selected === name} style={{ left: `${50 + 42 * Math.cos(angle)}%`, top: `${50 + 42 * Math.sin(angle)}%` }}>{name}</button>;
      })}
    </div>
    <div className="palace-caption"><span>你正在看</span><strong>{selected}</strong><p>{detail}</p></div>
  </div>;
}

export default function Home() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [group, setGroup] = useState('全部');
  const [selectedPalace, setSelectedPalace] = useState('命宮');
  const [query, setQuery] = useState('');
  const [answers, setAnswers] = useState<Record<number, number>>({});
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const saved = window.localStorage.getItem('ziwei-course-progress');
      if (saved) setCompleted(JSON.parse(saved));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);
  const toggleStage = (id: string) => setCompleted((previous) => { const next = previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id]; window.localStorage.setItem('ziwei-course-progress', JSON.stringify(next)); return next; });
  const progress = Math.round(completed.length / stages.length * 100);
  const stars = useMemo(() => group === '全部' ? starCards : starCards.filter((star) => star[3] === group), [group]);
  const terms = glossary.filter(([name, description]) => `${name}${description}`.includes(query.trim()));

  return <main id="top">
    <header className="site-header">
      <a className="brand" href="#top" aria-label="回到頁首"><span className="brand-mark">紫</span><span><strong>紫微斗數・大師課</strong><small>文化符號閱讀 × 循序學習</small></span></a>
      <nav aria-label="主要導覽"><a href="#path">學習地圖</a><a href="#explore">互動探索</a><a href="#practice">練習</a></nav>
      <a className="header-progress" href="#path"><span>{progress}%</span><i style={{ '--progress': `${progress}%` } as React.CSSProperties} /></a>
    </header>

    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-art" aria-hidden="true" />
      <div className="hero-overlay" />
      <div className="hero-copy"><p className="eyebrow"><Sparkles size={15} /> 繁體中文校勘・183 份課程素材</p><h1 id="hero-title">不要背一堆星名。<br /><em>先學會讀懂一張盤。</em></h1><p className="lede">為高中生設計的紫微斗數學習路徑：把術語拆成可以一步步練習的閱讀工具，清楚分開「可觀察的線索」與「不能推出的結論」。</p><div className="hero-actions"><a className="primary-action" href="#path">展開學習地圖 <ArrowDown size={17} /></a><a className="quiet-action" href="#explore"><Compass size={17} /> 先玩互動探索</a></div><div className="hero-proof"><span><Check size={14} /> 先結構，後判讀</span><span><Check size={14} /> 保留版本衝突</span><span><Check size={14} /> 不做人生預言</span></div></div>
      <aside className="hero-route"><p>今天從哪裡開始？</p><ol>{stages.slice(0, 4).map((stage) => <li key={stage[0]}><b>{stage[1]}</b><span>{stage[2]}</span></li>)}</ol><a href="#path">查看完整 8 階 <ArrowRight size={14} /></a></aside>
    </section>
    <section className="principle-bar"><span><ShieldCheck size={18} /> 來源有邊界</span><span><Layers3 size={18} /> 規則圖重新繪製</span><span><CircleHelp size={18} /> 待考不硬猜</span><span><GraduationCap size={18} /> 每章可自我檢核</span></section>

    <section className="intro-section content-width" id="method"><div className="section-kicker"><span>READING METHOD</span><i /></div><div className="intro-grid"><div><h2>一張命盤，<br />不是一個答案機器。</h2><p>把它想成一張有角色、有場景、有互動的故事地圖。讀盤不是「看見一個符號就斷定結果」，而是依序問對問題。</p></div><div className="three-questions">{[['①', '位置', '這一格在談哪個人生議題？'], ['②', '角色', '有哪些星曜正在提供線索？'], ['③', '關係', '組合、四化與對宮怎麼改變語意？']].map(([number, title, detail]) => <article key={title}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div></div><blockquote><Eye size={19} /><span><b>先記住：</b>任何一個星曜、宮位或表格，離開位置、組合與時間條件，都不該被當成人生結論。</span></blockquote></section>

    <section className="path-section" id="path"><div className="content-width section-heading"><div><p className="eyebrow">MASTER PATH・八階學路</p><h2>把複雜內容拆成<br />走得完的路。</h2></div><p>點一下每一階，替自己留下學習足跡。進度只會存在你的這台裝置。</p></div><div className="content-width path-layout"><div className="path-grid">{stages.map((stage) => { const done = completed.includes(stage[0]); return <article className={`stage-card ${done ? 'is-done' : ''}`} key={stage[0]}><span>{stage[1]}</span><div><h3>{stage[2]}</h3><p>{stage[3]}</p><small>{stage[4]}</small><button type="button" onClick={() => toggleStage(stage[0])} aria-pressed={done}>{done ? <><Check size={15} /> 已完成</> : '標記完成'}</button></div></article>; })}</div><aside className="progress-card"><div className="progress-ring" style={{ '--progress': `${progress}%` } as React.CSSProperties}><b>{progress}%</b><small>已走完</small></div><h3>你的學習足跡</h3><p>完成一階，再挑下一階。練習比一次看完更重要。</p><a href="#practice">去做 3 題快問快答 <ArrowRight size={15} /></a></aside></div></section>

    <section className="explore-section content-width" id="explore"><div className="section-heading"><div><p className="eyebrow">EXPLORE・互動探索</p><h2>先把名詞變成<br />可以記住的角色。</h2></div><p>角色卡只是記憶橋梁。真正閱讀時，要回到宮位、組合與限制。</p></div><div className="explorer-head"><div className="filter-tabs" role="tablist">{['全部', '穩定型', '思考型', '關係型', '行動型'].map((item) => <button key={item} type="button" className={group === item ? 'is-active' : ''} onClick={() => setGroup(item)} aria-pressed={group === item}>{item}</button>)}</div><span><Star size={15} /> 14 個主星記憶卡</span></div><div className="star-grid">{stars.map(([name, focus, note, type], index) => <article className="star-card" key={name}><span className="star-orbit">{String(index + 1).padStart(2, '0')}</span><div className="star-glyph">{name.slice(0, 1)}</div><p>{type}</p><h3>{name}</h3><strong>{focus}</strong><span className="star-note">{note}</span><details><summary>怎麼用這張卡？ <ChevronDown size={15} /></summary><span>先把它當成角色線索，再回到宮位、其他星曜與四化確認條件。</span></details></article>)}</div><div className="cannot-card"><X size={20} /><div><b>不能推出什麼</b><p>「有某主星」不等於性格被決定，也不等於能對學業、工作、健康、金錢或關係做預言。</p></div></div></section>

    <section className="transform-section"><div className="content-width"><div className="section-heading inverse"><div><p className="eyebrow">FOUR TRANSFORMATIONS・四化</p><h2>不是四個吉凶章。<br />是四個閱讀焦點。</h2></div><p>把四化當成螢光筆：它讓你知道哪個地方值得多問一句「在什麼條件下？」</p></div><div className="transform-grid">{transformations.map(([symbol, title, detail, tone]) => <article className={`transform-card ${tone}`} key={symbol}><span>{symbol}</span><h3>{title}</h3><p>{detail}</p><div><Eye size={15} /> 看見線索，不宣告命運</div></article>)}</div></div></section>

    <section className="table-section content-width" id="stems"><div className="section-heading"><div><p className="eyebrow">TEN STEMS・十天干四化</p><h2>查表可以很清楚，<br />也可以誠實保留衝突。</h2></div><p>下表整理本課採用的查表內容；庚列出兩個版本，因此不做唯一裁決。</p></div><div className="table-shell"><table><thead><tr><th>天干</th><th>化祿</th><th>化權</th><th>化科</th><th>化忌</th></tr></thead><tbody>{tenStems.map((row) => <tr key={row[0]} className={row[0].startsWith('庚') ? 'version-row' : ''}>{row.map((cell, index) => <td key={`${row[0]}-${cell}`}>{index === 0 && row[0].startsWith('庚') ? <><i className="version-dot" />{cell}</> : cell}</td>)}</tr>)}</tbody></table></div><div className="version-note"><CircleHelp size={18} /><p><b>庚的 A／B 版本：</b>兩列都是教材要保留的來源說法。看到衝突時，最好的做法是標示版本與來源，而不是假裝只有一種答案。</p></div></section>

    <section className="palace-section" id="palaces"><div className="content-width palace-layout"><div><p className="eyebrow">TWELVE PALACES・十二宮位</p><h2>先選場景，<br />再讀角色。</h2><p>十二宮位像十二個問題框。點選一個宮位，先記住它主要在幫你整理哪一類議題；這不是把人塞進固定命運格子。</p><div className="palace-rules"><span><Check size={15} /> 宮位是問題框</span><span><Check size={15} /> 星曜是角色線索</span><span><Check size={15} /> 互動才形成語句</span></div></div><PalaceWheel selected={selectedPalace} onSelect={setSelectedPalace} /></div></section>

    <section className="dark-pair-section content-width"><div className="dark-copy"><p className="eyebrow">RELATION MAP・暗合六合</p><h2>關係線，<br />不是事件預告。</h2><p>本課的暗合圖提供六組地支對照。它可以幫你記住結構關係；單靠這張圖，不能推成真實事件、關係結果或職涯結果。</p></div><div className="pair-visual"><svg viewBox="0 0 620 340" aria-labelledby="pair-map-title"><title id="pair-map-title">巳申、午未、辰酉、卯戌、寅亥、丑子六組對照</title><defs><linearGradient id="pairFade" x1="0" x2="1"><stop stopColor="#d5aa63" /><stop offset="1" stopColor="#d85c40" /></linearGradient></defs>{[['巳', '申'], ['午', '未'], ['辰', '酉'], ['卯', '戌'], ['寅', '亥'], ['丑', '子']].map(([left, right], index) => { const y = 35 + index * 53; return <g key={`${left}${right}`}><circle cx="86" cy={y} r="21" /><text x="86" y={y + 6}>{left}</text><line x1="114" y1={y} x2="506" y2={y} stroke="url(#pairFade)" strokeWidth="2" /><path d={`M500 ${y - 5} L512 ${y} L500 ${y + 5}`} /><path d={`M120 ${y - 5} L108 ${y} L120 ${y + 5}`} /><circle cx="534" cy={y} r="21" /><text x="534" y={y + 6}>{right}</text></g>; })}</svg><p><Eye size={15} /> 看的是雙向對照關係；不加入公式符號，也不直接論命。</p></div></section>

    <section className="glossary-section" id="glossary"><div className="content-width"><div className="section-heading"><div><p className="eyebrow">GLOSSARY・白話詞典</p><h2>忘了術語？<br />用白話把它找回來。</h2></div><p>先懂字在這門課裡怎麼使用，再回到對應章節練習。</p></div><label className="search-box"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="輸入：四化、宮位、雙星…" aria-label="搜尋核心詞彙" /><span>{terms.length} 筆</span></label><div className="glossary-grid">{terms.map(([term, description]) => <article key={term}><h3>{term}</h3><p>{description}</p></article>)}</div></div></section>

    <section className="practice-section" id="practice"><div className="content-width"><div className="section-heading inverse"><div><p className="eyebrow">CHECK YOURSELF・快問快答</p><h2>答對不是終點。<br />說得出限制才是。</h2></div><p>三題只測核心閱讀觀念。每題都提醒你：何時應該停下來，不要過度推論。</p></div><div className="quiz-grid">{quizzes.map(([question, options, answer, explanation], quizIndex) => <article className="quiz-card" key={question}><span>Q{quizIndex + 1}</span><h3>{question}</h3><div>{options.map((option, index) => <button key={option} type="button" className={answers[quizIndex] === index ? (index === answer ? 'correct' : 'incorrect') : ''} onClick={() => setAnswers((previous) => ({ ...previous, [quizIndex]: index }))}>{option}<ArrowRight size={15} /></button>)}</div>{answers[quizIndex] !== undefined && <p className={`feedback ${answers[quizIndex] === answer ? 'correct-text' : ''}`}>{answers[quizIndex] === answer ? <Check size={16} /> : <X size={16} />}{answers[quizIndex] === answer ? explanation : '再想一下：回到「位置、角色、關係」與課程的安全邊界。'}</p>}</article>)}</div></div></section>

    <section className="safety-section content-width"><div className="safety-icon"><ShieldCheck size={30} /></div><div><p className="eyebrow">RESPONSIBLE USE・使用邊界</p><h2>這是一門傳統命理的文化與符號閱讀課。</h2><p>它不是科學實證的預測工具，也不取代醫療、法律、心理、財務或關係專業判斷。遇到健康、危險、金錢、權益或人際困擾，請依可靠資訊與合格專業者的協助做決定。</p></div><a href="#method">回到閱讀方法 <ArrowRight size={16} /></a></section>
    <footer><div><strong>紫微斗數・大師課</strong><span>用結構學習，用證據說話。</span></div><a href="#top">回到頁首 <ArrowDown size={15} /></a></footer>
  </main>;
}
