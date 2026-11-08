"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Badge, Bar, Card, Check, Count, Row, Stage, States, Text, Window, type Act } from "./kit";
import "./venture-stages.css";

// Pictures for the Ventures bento (stageshow references/bento.md, gold:
// examples/bento). One Stage per tile at 1:1, sized to the tile's measured
// width and pinned to its bottom so the tile does the crop. Each plays one
// short story once as it scrolls in; the poster is the payoff.
//
//   Tile     Kind       The one thing                        Real strings
//   Farms    Hero UI    shed 3 logs a batch, total rolls      label, total, 3 sheds, badge
//   Agency   Component  a site ticks Brief → Launch by day 7  title, 4 steps, day badge

// The site's navy & gold neutrals, so the stages sit in the page instead of on
// the kit's own grays.
const DARK = {
    "--ss-canvas": "#111830",
    "--ss-surface": "#18213D",
    "--ss-chrome": "#1A2442",
    "--ss-fill": "#243052",
    "--ss-text": "#8C94A8",
    "--ss-text-strong": "#F3F1EA",
    "--ss-text-faint": "#5E6782",
};
const LIGHT = { "--ss-canvas": "#FBFAF7" };

function useLook() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const dark = mounted && resolvedTheme === "dark";
    return {
        theme: dark ? ("dark" as const) : ("light" as const),
        accent: dark ? "#D4A72C" : "#14213D",
        tokens: dark ? DARK : LIGHT,
    };
}

/** The picture slot's width, so the Stage draws at 1:1 and never slices early. */
function useSlotWidth(initial: number) {
    const ref = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(initial);
    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) return;
        const measure = () => setWidth(Math.max(1, Math.round(node.getBoundingClientRect().width)));
        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(node);
        return () => ro.disconnect();
    }, []);
    return [ref, width] as const;
}

/* ── Farms: the tracker ──────────────────────────────────────────────── */

type Farm = { logging: boolean; logged: boolean; ready: boolean };
const farmFrom: Farm = { logging: false, logged: false, ready: false };
const farmTo: Farm = { logging: true, logged: true, ready: true };

async function farmScript(a: Act<Farm>) {
    await a.wait(700);
    a.put({ logging: true });
    await a.wait(1100);
    a.put({ logged: true });
    await a.wait(1500);
    a.put({ ready: true });
    await a.wait(2000);
}

// Figures are illustrative, sized to the farm's real ones: five sheds,
// 10,000-bird capacity, about 5,000 birds a month (farms.zerod.bd).
const SHEDS = [
    { name: "Shed 1", before: 1240, after: 1240 },
    { name: "Shed 2", before: 1180, after: 1180 },
    { name: "Shed 3", before: 960, after: 1180 },
];

export function FarmTracker() {
    const look = useLook();
    const [slot, width] = useSlotWidth(640);
    const narrow = width < 460;
    return (
        <div ref={slot} className="vs-slot">
            <Stage
                width={width}
                height={narrow ? 292 : 222}
                initial={farmFrom}
                poster={farmTo}
                script={farmScript}
                play="once"
                theme={look.theme}
                accent={look.accent}
                tokens={look.tokens}
                className="vs vs-farm"
            >
                {(s) => (
                    <Window url="farms.zerod.bd" urlShape="pill" className="vs-farm-win">
                        <div className="vs-farm-body" data-narrow={narrow || undefined}>
                            <div className="vs-farm-head">
                                <Text className="vs-label">Raised this month</Text>
                                <div className="vs-total">
                                    <Count value={s.logged ? 5040 : 4820} duration={900} />
                                </div>
                                <div className="vs-farm-badge">
                                    <States
                                        value={s.ready ? "ready" : "working"}
                                        align="start"
                                        states={{
                                            working: <Badge tone="neutral">Logging batch</Badge>,
                                            ready: <Badge tone="success">On target</Badge>,
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="vs-farm-rows">
                                {SHEDS.map((shed, i) => {
                                    const live = i === 2;
                                    return (
                                        <Row
                                            key={shed.name}
                                            pad={0}
                                            className="vs-shed"
                                            data-live={(live && s.logging) || undefined}
                                            lead={
                                                <Check
                                                    on={!live || s.logged}
                                                    pending={live && s.logging}
                                                />
                                            }
                                            title={
                                                <Text className="vs-shed-name">{shed.name}</Text>
                                            }
                                            meta={
                                                <span className="vs-count">
                                                    <Count
                                                        value={
                                                            live && s.logged
                                                                ? shed.after
                                                                : shed.before
                                                        }
                                                    />
                                                </span>
                                            }
                                        />
                                    );
                                })}
                                <Row
                                    pad={0}
                                    lead={<Check on={false} />}
                                    title={<Bar w={64} h={7} r={3.5} tone={2} />}
                                />
                                <Row
                                    pad={0}
                                    lead={<Check on={false} />}
                                    title={<Bar w={52} h={7} r={3.5} tone={2} />}
                                />
                            </div>
                        </div>
                    </Window>
                )}
            </Stage>
        </div>
    );
}

/* ── Agency: the delivery stepper ────────────────────────────────────── */

type Ship = { done: number };
const STEPS = ["Brief", "Design", "Build", "Launch"];
const DAYS = [1, 2, 4, 6, 7];
const shipFrom: Ship = { done: 0 };
const shipTo: Ship = { done: STEPS.length };

async function shipScript(a: Act<Ship>) {
    await a.wait(900);
    for (let i = 1; i <= STEPS.length; i++) {
        a.put({ done: i });
        await a.wait(i === STEPS.length ? 2000 : 850);
    }
}

export function DeliveryStepper() {
    const look = useLook();
    const [slot, width] = useSlotWidth(320);
    return (
        <div ref={slot} className="vs-slot">
            <Stage
                width={width}
                height={196}
                initial={shipFrom}
                poster={shipTo}
                script={shipScript}
                play="once"
                theme={look.theme}
                accent={look.accent}
                tokens={look.tokens}
                className="vs vs-ship"
            >
                {(s) => (
                    <Card pad="large" lift className="vs-ship-card">
                        <div className="vs-ship-head">
                            <Text className="vs-ship-title">New website</Text>
                            <States
                                value={s.done === STEPS.length ? "live" : "day"}
                                align="end"
                                states={{
                                    day: (
                                        <Badge tone="neutral">
                                            Day <Count value={DAYS[s.done]} />
                                        </Badge>
                                    ),
                                    live: <Badge tone="success">Live on day 7</Badge>,
                                }}
                            />
                        </div>
                        {STEPS.map((step, i) => (
                            <Row
                                key={step}
                                pad={0}
                                className="vs-step"
                                data-on={i < s.done || undefined}
                                lead={<Check on={i < s.done} pending={i === s.done} />}
                                title={<Text className="vs-step-name">{step}</Text>}
                            />
                        ))}
                    </Card>
                )}
            </Stage>
        </div>
    );
}
