'use client';

import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, ChevronRight, Sparkles } from 'lucide-react';
import BubbleGarden from './BubbleGarden';
import MovieEditor from './MovieEditor';
import {
  getDirectionSummaries,
  type Audience,
  type StoryFormat,
} from './story-data';

type Character = {
  name: string;
  role: string;
  note: string;
  image: string;
  video?: string;
};
type Story = {
  title: string;
  badge: string;
  tension: string;
  premise: string;
  rhythm: string;
  characters: Character[];
};

const looks = [
  {
    name: '林晚',
    image: '/characters/fashion-woman.jpg',
    video: '/media/woman-01.mp4',
  },
  {
    name: '陈默',
    image: '/characters/fashion-man.jpg',
    video: '/media/man-01.mp4',
  },
  {
    name: '夏栀',
    image: '/characters/fashion-woman-2.jpg',
    video: '/media/woman-02.mp4',
  },
  {
    name: '周砚',
    image: '/characters/fashion-man-3.jpg',
    video: '/media/man-02.mp4',
  },
  {
    name: '宋一',
    image: '/characters/fashion-woman-3.jpg',
    video: '/media/woman-03.mp4',
  },
  {
    name: '陆衡',
    image: '/characters/fashion-man-2.jpg',
    video: '/media/man-03.mp4',
  },
];

const storySeeds = [
  {
    title: '冰封倒计时',
    badge: '末日生存 · 情感悬疑',
    tension: '30 天后全城失温，唯一的安全屋只剩两个席位。',
    premise:
      '前气象研究员林晚提前收到未来的停电记录。她必须一边囤积物资，一边判断身边五个人谁在隐瞒灾难源头。',
    rhythm: '倒计时推进 / 资源选择 / 阵营反转',
  },
  {
    title: '第七次来电',
    badge: '都市悬疑 · 双向救赎',
    tension: '每晚零点，她都会接到七天后的自己打来的电话。',
    premise:
      '一通来自未来的求救，让调查记者和失踪案嫌疑人被迫结盟。每改变一个细节，现实里就会消失一段共同记忆。',
    rhythm: '线索拼图 / 关系升温 / 记忆代价',
  },
  {
    title: '雾港合伙人',
    badge: '商战群像 · 身份反转',
    tension: '融资签约前夜，创始团队发现公司里有两份完全不同的股权表。',
    premise:
      '六位年轻人被困在停航的海港酒店，必须在天亮前找出泄密者，也决定这家公司究竟属于谁。',
    rhythm: '封闭空间 / 多方博弈 / 连续翻盘',
  },
  {
    title: '长夜见证人',
    badge: '罪案推理 · 女性成长',
    tension: '她看见了凶手，却发现所有监控里都没有自己。',
    premise:
      '年轻律师追查一桩被撤销的旧案，逐渐发现五位证人的人生彼此咬合，而她正是被删除的第六人。',
    rhythm: '不可靠叙事 / 证词对撞 / 终极自证',
  },
  {
    title: '白昼失重',
    badge: '近未来 · 浪漫冒险',
    tension: '城市每天失重十一分钟，只有他们知道下一次不会结束。',
    premise:
      '航天工程师与危机主播组成临时搭档，在全城秩序崩塌前寻找被隐藏的地面控制站，也重新确认彼此的选择。',
    rhythm: '奇观危机 / 双主角 / 开放式结局',
  },
];

const roleSets = [
  [
    ['主角', '前气象研究员 · 冷静、克制，是唯一相信预警的人'],
    ['关键盟友', '急诊医生 · 表面疏离，掌握第一批异常病例'],
    ['行动搭档', '户外博主 · 负责物资与路线，却藏着一张旧地图'],
    ['对立者', '能源集团继承人 · 想用席位交换所有人的忠诚'],
    ['情报者', '电台主播 · 声音温柔，消息来源始终成谜'],
    ['守门人', '安全屋设计师 · 知道庇护所真正的容量'],
  ],
  [
    ['主角', '调查记者 · 追真相时从不后退'],
    ['嫌疑人', '神经外科医生 · 是她唯一无法证伪的人'],
    ['失踪者', '影像艺术家 · 在每段录像里留下不同答案'],
    ['刑警', '旧案负责人 · 坚信记忆比证据更危险'],
    ['编辑', '新闻主编 · 一直替主角挡住外界压力'],
    ['知情人', '深夜便利店老板 · 记得每一次时间改写'],
  ],
];

function buildStories(): Story[] {
  return storySeeds.map((story, storyIndex) => ({
    ...story,
    characters: (roleSets[storyIndex % roleSets.length] as string[][]).map(
      (copy, index) => {
        const look = looks[(index + storyIndex) % looks.length];
        return { ...look, role: copy[0], note: copy[1] };
      },
    ),
  }));
}

export default function CreatorFlow({
  notify,
}: {
  notify: (message: string) => void;
}) {
  const [view, setView] = useState<'select' | 'stories' | 'editor'>('select');
  const [audience, setAudience] = useState<Audience>('女性向');
  const [format, setFormat] = useState<StoryFormat>('互动游戏');
  const [trail, setTrail] = useState<string[]>([]);
  const [directionIndex, setDirectionIndex] = useState(0);
  const stories = useMemo(buildStories, []);
  const directions = getDirectionSummaries(trail, audience, format);

  if (view === 'editor')
    return <MovieEditor back={() => setView('stories')} notify={notify} />;
  if (view === 'stories') {
    return (
      <StoryAndCharacters
        stories={stories}
        direction={directions[directionIndex]?.title ?? directions[0].title}
        onBack={() => setView('select')}
        onNext={() => setView('editor')}
      />
    );
  }

  return (
    <section className="creator-page selection-page creation-space">
      <div className="space-light space-light-a" />
      <div className="space-light space-light-b" />
      <header>
        <span className="spark-logo">
          火花
          <i />
        </span>
        <h1>描述你的故事方向</h1>
      </header>
      <div className="fixed-picks glass-tabs">
        <div>
          {(['女性向', '男性向'] as Audience[]).map((item) => (
            <button
              className={audience === item ? 'selected' : ''}
              key={item}
              onClick={() => {
                setAudience(item);
                setTrail([]);
                setDirectionIndex(0);
              }}
            >
              {item}
            </button>
          ))}
        </div>
        <div>
          {(['互动游戏', '短剧'] as StoryFormat[]).map((item) => (
            <button
              className={format === item ? 'selected' : ''}
              key={item}
              onClick={() => {
                setFormat(item);
                setTrail([]);
                setDirectionIndex(0);
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <BubbleGarden
        audience={audience}
        format={format}
        onChange={(labels) => {
          setTrail(labels);
          setDirectionIndex(0);
        }}
      />
      <div className="topic-section direction-dock">
        <div className="topic-head">
          <span>
            创作方向 · 根据 {Math.max(2, trail.length + 2)} 个需求生成
          </span>
          <small>具体故事将在下一页展开</small>
        </div>
        <div className="direction-row">
          {directions.map((direction, index) => (
            <button
              className={directionIndex === index ? 'selected' : ''}
              key={`${index}-${direction.title}`}
              onClick={() => setDirectionIndex(index)}
            >
              <span>0{index + 1}</span>
              <div>
                <h3>{direction.title}</h3>
                <p>{direction.hook}</p>
              </div>
              {directionIndex === index && <Check />}
            </button>
          ))}
        </div>
        <button className="direction-next" onClick={() => setView('stories')}>
          查看这个方向的故事
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}

function StoryAndCharacters({
  stories,
  direction,
  onBack,
  onNext,
}: {
  stories: Story[];
  direction: string;
  onBack: () => void;
  onNext: () => void;
}) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [characterIndex, setCharacterIndex] = useState(0);
  const [characterFocused, setCharacterFocused] = useState(false);
  const storyTrack = useRef<HTMLDivElement>(null);
  const characterTrack = useRef<HTMLDivElement>(null);
  const characterProgramScroll = useRef(false);
  const story = stories[storyIndex];
  const expanded = characterFocused;

  function pickStory(index: number) {
    setStoryIndex(index);
    setCharacterIndex(0);
    setCharacterFocused(false);
    characterTrack.current?.scrollTo({ left: 0 });
    storyTrack.current?.children[index]?.scrollIntoView({
      inline: 'center',
      behavior: 'smooth',
      block: 'nearest',
    });
  }

  return (
    <section
      className={`creator-page story-casting-page creation-space ${expanded ? 'character-focus' : ''}`}
    >
      <div className="space-light space-light-a" />
      <div className="space-light space-light-b" />
      <header>
        <button aria-label="返回选择方向" onClick={onBack}>
          <ArrowLeft />
        </button>
        <div aria-label={direction} />
        <span>
          {storyIndex + 1}/{stories.length}
        </span>
      </header>

      <div className="story-zone">
        <div className="story-runway" ref={storyTrack}
          onScroll={(event) => {
            const el = event.currentTarget;
            const cards = Array.from(el.children) as HTMLElement[];
            const center = el.getBoundingClientRect().left + el.clientWidth / 2;
            const nearest = cards.reduce((best, card, index) =>
              Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center) <
              Math.abs(cards[best].getBoundingClientRect().left + cards[best].offsetWidth / 2 - center) ? index : best, 0);
            if (nearest !== storyIndex) {
              setStoryIndex(nearest);
              setCharacterIndex(0);
              setCharacterFocused(false);
              characterTrack.current?.scrollTo({ left: 0 });
            }
          }}>
          {stories.map((item, index) => (
            <button
              className={`story-poster ${storyIndex === index ? 'selected' : ''}`}
              key={item.title}
              onClick={() => pickStory(index)}
            >
              <span className="story-number">0{index + 1}</span>
              <small>{item.badge}</small>
              <h2>{item.title}</h2>
              <div className="story-details">
                <b>核心矛盾</b>
                <p>{item.tension}</p>
                <b>剧情设计</b>
                <p>{item.premise}</p>
                <em>{item.rhythm}</em>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="character-zone">
        <div
          className="character-runway"
          ref={characterTrack}
          onScroll={(event) => {
            if (characterProgramScroll.current) return;
            const el = event.currentTarget;
            const cards = Array.from(el.children) as HTMLElement[];
            if (!cards.length) return;
            const center = el.getBoundingClientRect().left + el.clientWidth / 2;
            const nearest = cards.reduce((best, card, index) =>
              Math.abs(card.getBoundingClientRect().left + card.offsetWidth / 2 - center) <
              Math.abs(cards[best].getBoundingClientRect().left + cards[best].offsetWidth / 2 - center) ? index : best, 0);
            if (nearest !== characterIndex) setCharacterIndex(nearest);
          }}
        >
          {story.characters.map((character, index) => {
            const isOpen = characterIndex === index;
            return (
              <button
                className={`casting-card ${expanded ? 'expanded' : ''} ${isOpen ? 'selected' : ''}`}
                key={`${story.title}-${character.name}`}
                onClick={(event) => {
                  setCharacterIndex(index);
                  setCharacterFocused(true);
                  characterProgramScroll.current = true;
                  const card = event.currentTarget;
                  requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                      card.scrollIntoView({
                        inline: 'center',
                        block: 'nearest',
                        behavior: 'smooth',
                      });
                      window.setTimeout(() => {
                        characterProgramScroll.current = false;
                      }, 500);
                    });
                  });
                }}
              >
                {character.video ? (
                  <video
                    src={character.video}
                    autoPlay={isOpen}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                ) : (
                  <img src={character.image} alt={character.name} />
                )}
                <div>
                  <small>{character.role}</small>
                  <h3>{character.name}</h3>
                  {expanded && <p>{character.note}</p>}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <button className="floating-next" onClick={onNext}>
        <Sparkles />
        <span>使用这个故事与角色</span>
        <ChevronRight />
      </button>
    </section>
  );
}
