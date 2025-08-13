"use client"
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    { year: "2025", regional: 70, collective: 60 },
    { year: "2024", regional: 70, collective: 60 },
    { year: "2023", regional: 70, collective: 60 },
    { year: "2022", regional: 70, collective: 60 },
    { year: "2021", regional: 70, collective: 60 },
    { year: "2020", regional: 70, collective: 60 },
    { year: "2019", regional: 70, collective: 60 },
    { year: "2018", regional: 70, collective: 60 },
]

const YAxisLeftTick = ({ y, payload: { value } }) => {
    return (
        <text x={0} y={y} textAnchor="start" verticalAnchor="middle" fontSize={12} fill="#374151">
            {value}
        </text>
    )
}

let ctx
const measureText = (text) => {
    if (!ctx) {
        ctx = document.createElement("canvas").getContext("2d")
        ctx.font = "12px system-ui"
    }
    return ctx.measureText(text).width
}

const CustomLegend = () => (
    <div className="mt-6 space-y-2">
        <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-blue-700"></div>
            <span className="text-sm text-gray-700">Moyenne des budget des collectivités régionales</span>
        </div>
        <div className="flex items-center gap-2">
            <div
                className="w-4 h-3"
                style={{
                    background: `repeating-linear-gradient(
            45deg,
            #1e40af,
            #1e40af 2px,
            transparent 2px,
            transparent 4px
          )`,
                }}
            ></div>
            <span className="text-sm text-gray-700">Budget de collectivité</span>
        </div>
    </div>
)

export default function DoubleBarChart() {
    const maxTextWidth = data.reduce((acc, cur) => {
        const regionalWidth = measureText(`${cur.regional}M`)
        const collectiveWidth = measureText(`${cur.collective}M`)
        const maxWidth = Math.max(regionalWidth, collectiveWidth)
        return maxWidth > acc ? maxWidth : acc
    }, 0)

    return (
        <>
            <div className="space-y-1">
                {data.map((item, index) => (
                    <div key={item.year} className="flex items-center gap-2 py-1">
                        <div className="w-10 text-sm font-medium text-gray-700">{item.year}</div>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={40}>
                                <BarChart data={[item]} layout="vertical" margin={{ left: 0, right: 60, top: 2, bottom: 2 }}>
                                    <XAxis hide type="number" domain={[0, 80]} />
                                    <YAxis hide type="category" />

                                    <Bar dataKey="regional" barSize={18} radius={[0, 0, 4, 0]}>
                                        <Cell fill="#1e40af" stroke="#1e3a8a" strokeWidth={1} />
                                        <LabelList
                                            dataKey="regional"
                                            position="right"
                                            formatter={(value) => `${value}M`}
                                            style={{ fontSize: "12px", fill: "#1e40af", fontWeight: "600" }}
                                        />
                                    </Bar>

                                    <Bar dataKey="collective" barSize={18} radius={[0, 0, 4, 0]} y={22}>
                                        <Cell fill="url(#stripes)" stroke="#1e3a8a" strokeWidth={1} />
                                        <LabelList
                                            dataKey="collective"
                                            position="right"
                                            formatter={(value) => `${value}M`}
                                            style={{ fontSize: "12px", fill: "#1e40af", fontWeight: "600" }}
                                        />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                ))}
            </div>

            <svg width="0" height="0">
                <defs>
                    <pattern id="stripes" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                        <rect width="4" height="8" fill="#1e40af" />
                        <rect x="4" width="4" height="8" fill="transparent" />
                    </pattern>
                </defs>
            </svg>

        </>)
}
