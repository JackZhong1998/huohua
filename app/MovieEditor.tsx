'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Mic, Pause, Play, RotateCcw } from 'lucide-react';
const clips = [
    {
      video: '/media/woman-01.mp4',
    },
    {
      video: '/media/man-01.mp4',
    },
    {
      video: '/media/woman-02.mp4',
    },
    {
      video: '/media/man-02.mp4',
    },
    {
      video: '/media/woman-04.mp4',
    },
    {
      video: '/media/man-04.mp4',
    },
  ],
  names = [
    '序章',
    '第一次预警',
    '秘密会面',
    '物资争夺',
    '身份揭晓',
    '最终选择',
  ];
const seconds = 5,
  width = 82,
  total = 30;
export default function MovieEditor({
  back,
  notify,
}: {
  back: () => void;
  notify: (s: string) => void;
}) {
  const [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(true),
    [holding, setHolding] = useState(false);
  const track = useRef<HTMLDivElement>(null),
    video = useRef<HTMLVideoElement>(null),
    position = useRef(0),
    active = useRef(0),
    running = useRef(true),
    scrubUntil = useRef(0),
    programScroll = useRef(-1),
    hold = useRef<ReturnType<typeof setTimeout> | null>(null),
    recording = useRef(false);
  function seek(t: number) {
    t = Math.max(0, Math.min(total - 0.01, t));
    position.current = t;
    const i = Math.min(5, Math.floor(t / seconds));
    active.current = i;
    setIndex(i);

  }
  function toggle() {
    running.current = !running.current;
    setPlaying(running.current);

  }
  useEffect(() => {
    const current = video.current;
    if (!current) return;
    if (playing) current.play().catch(() => {});
    else current.pause();
  }, [index, playing]);
  useEffect(() => {
    let frame = 0;
    let previous = performance.now();
    function tick() {
      const now = performance.now();
      const delta = Math.min((now - previous) / 1000, 0.1);
      previous = now;
      if (running.current && now > scrubUntil.current) {
        position.current = (position.current + delta) % total;
        const nextIndex = Math.floor(position.current / seconds);
        if (nextIndex !== active.current) { active.current = nextIndex; setIndex(nextIndex); }
        const el = track.current;
        if (el) {
          const x = (position.current / seconds) * width;
          programScroll.current = x;
          el.scrollLeft = x;
        }
      }
      frame = requestAnimationFrame(tick);
    }
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (hold.current) clearTimeout(hold.current);
    };
  }, []);
  function scroll() {
    const el = track.current;
    if (!el) return;
    if (Math.abs(el.scrollLeft - programScroll.current) < 1.5) return;
    scrubUntil.current = performance.now() + 180;
    running.current = true;
    setPlaying(true);
    seek((el.scrollLeft / width) * seconds);
  }
  function release() {
    if (hold.current) clearTimeout(hold.current);
    if (recording.current) {
      recording.current = false;
      setHolding(false);
      notify('语音修改已记录');
    }
  }
  return (
    <section className="editor-page movie-editor">
      <div className="native-video" onClick={toggle}>
        <video
          key={clips[index].video}
          ref={video}
          src={clips[index].video}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <header>
        <button aria-label="返回故事与角色" onClick={back}>
          <ArrowLeft />
        </button>
        <span>
          冰封之前<small>自动保存</small>
        </span>
        <button onClick={() => notify('正在导出影片')}>导出</button>
      </header>
      <div className="editor-control">
        <div className="playhead">
          <i />
        </div>
        <div
          ref={track}
          className="clip-track movie-track"
          aria-label="影片时间线"
          tabIndex={0}
          onScroll={scroll}
          onPointerDown={() => {
            scrubUntil.current = performance.now() + 1000;
          }}
        >
          {names.map((name, i) => (
            <button
              key={name}
              className={index === i ? 'selected' : ''}
              onClick={() => {
                running.current = true;
                setPlaying(true);
                seek(i * seconds);
                if (track.current) {
                  programScroll.current = i * width;
                  track.current.scrollLeft = i * width;
                }
              }}
            >
              <video src={clips[i].video} muted playsInline preload="metadata" />
              <span>{name}</span>
              <small>00:05</small>
            </button>
          ))}
        </div>
        <button
          className="editor-play"
          aria-label={playing ? '暂停' : '播放'}
          onClick={toggle}
        >
          {playing ? <Pause /> : <Play />}
        </button>
      </div>
      <div className="editor-bottom">
        <div className="suggestions">
          {[
            '重新生成',
            '更紧张',
            '增加特写',
            '冰雪更大',
            '换成夜景',
            '加强对白',
          ].map((s, i) => (
            <button key={s} onClick={() => notify(`已提交：${s}`)}>
              {i === 0 && <RotateCcw />}
              {s}
            </button>
          ))}
        </div>
        <button
          aria-label="长按录音"
          className={`voice-button ${holding ? 'holding' : ''}`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            hold.current = setTimeout(() => {
              recording.current = true;
              setHolding(true);
            }, 280);
          }}
          onPointerUp={release}
          onPointerCancel={release}
        >
          <Mic />
          {holding && <span>松开发送</span>}
        </button>
      </div>
    </section>
  );
}
