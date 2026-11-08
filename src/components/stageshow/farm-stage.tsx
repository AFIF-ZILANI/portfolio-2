"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Badge, Bar, Check, Count, Row, Stage, States, Text, Window, type Act } from "./kit";
import "./farm-stage.css";

// Copied from the stageshow `window-row` gold. Three windows at one height, in the
// same order as the venture cards under them: zerod.bd, farms.zerod.bd,
// agency.zerod.bd. The middle one is the story and the only one with words.
// Beats: shed 3 starts logging a batch, its count rolls, the month's total rolls
// a beat later, then the badge confirms the target. Plays once; the still is the
// payoff (and the poster under reduced motion).
//
// Real strings: the label, the total, three shed rows, the badge.
// Figures are illustrative but sized to the farm's real numbers: 5 sheds,
// 10,000-bird capacity, ~5,000 birds a month (farms.zerod.bd).

// The site's navy & gold neutrals, so the stage sits in the page instead of on
// the kit's own grays.
const PAPER_LIGHT = { "--ss-well": "#EFEDE6" };
const NAVY_DARK = {
    "--ss-well": "#0D1426",
    "--ss-canvas": "#111830",
    "--ss-surface": "#18213D",
    "--ss-chrome": "#1A2442",
    "--ss-fill": "#243052",
    "--ss-text": "#8C94A8",
    "--ss-text-strong": "#F3F1EA",
    "--ss-text-faint": "#5E6782",
};

type S = { logging: boolean; logged: boolean; ready: boolean };

const initial: S = { logging: false, logged: false, ready: false };
const poster: S = { logging: true, logged: true, ready: true };

async function script(a: Act<S>) {
    await a.wait(900);
    a.put({ logging: true });
    await a.wait(1100);
    a.put({ logged: true });
    await a.wait(1500);
    a.put({ ready: true });
    await a.wait(2400);
}

const SHEDS = [
    { name: "Shed 1", before: 1240, after: 1240 },
    { name: "Shed 2", before: 1180, after: 1180 },
    { name: "Shed 3", before: 960, after: 1180 },
];

// The neighbors: busy but quiet, bars where the words would be
function Busy({ rows }: { rows: number[] }) {
    return (
        <div className="fs-body">
            {rows.map((w, i) => (
                <Row
                    key={i}
                    pad={0}
                    lead={<Check on={i < rows.length - 1} pending={i === rows.length - 1} />}
                    title={<Bar w={w} h={7} r={3.5} tone={i < rows.length - 1 ? 3 : 2} />}
                />
            ))}
        </div>
    );
}

export function FarmStage() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";

    return (
        <Stage
            width={960}
            height={376}
            fill
            compact={{ below: 720, width: 342, height: 356 }}
            initial={initial}
            poster={poster}
            script={script}
            play="once"
            theme={theme}
            accent={theme === "dark" ? "#D4A72C" : "#14213D"}
            tokens={theme === "dark" ? NAVY_DARK : PAPER_LIGHT}
            className="fs"
        >
            {(s) => (
                <>
                    <Window lights="grey" className="fs-win fs-win--left">
                        <Busy rows={[170, 130, 190, 120]} />
                    </Window>
                    <Window url="farms.zerod.bd" urlShape="pill" className="fs-win fs-win--hero">
                        <div className="fs-body">
                            <div className="fs-head">
                                <Text className="fs-label">Raised this month</Text>
                                <div className="fs-total">
                                    <Count value={s.logged ? 5040 : 4820} duration={900} />
                                </div>
                            </div>
                            {SHEDS.map((shed, i) => {
                                const live = i === 2;
                                return (
                                    <Row
                                        key={shed.name}
                                        pad={0}
                                        className="fs-shed"
                                        data-live={(live && s.logging) || undefined}
                                        lead={<Check on={!live || s.logged} pending={live && s.logging} />}
                                        title={<Text className="fs-shed__name">{shed.name}</Text>}
                                        meta={
                                            <span className="fs-shed__count">
                                                <Count value={live && s.logged ? shed.after : shed.before} />
                                            </span>
                                        }
                                    />
                                );
                            })}
                            <Row pad={0} lead={<Check on={false} />} title={<Bar w={64} h={7} r={3.5} tone={2} />} />
                            <div className="fs-foot">
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
                    </Window>
                    <Window lights="grey" className="fs-win fs-win--right">
                        <Busy rows={[140, 180, 110, 160]} />
                    </Window>
                </>
            )}
        </Stage>
    );
}
