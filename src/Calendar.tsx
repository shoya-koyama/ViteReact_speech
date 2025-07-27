import React, { useState, useEffect } from "react";

// 現在の月の日数を取得する関数
function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

// 月ごとの予定を保存するキーを生成
function getStorageKey(year: number, month: number) {
    return `plans_${year}_${month + 1}`;
}

const Calendar: React.FC = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth()); // 0-indexed
    const daysInMonth = getDaysInMonth(year, month);

    // 初期値をlocalStorageから取得
    const loadPlans = (y: number, m: number) => {
        const key = getStorageKey(y, m);
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : {};
    };
    const [plans, setPlans] = useState<{ [key: number]: string }>(() => loadPlans(year, month));

    // 月・年が変わったらlocalStorageから予定を読み込む
    useEffect(() => {
        setPlans(loadPlans(year, month));
    }, [year, month]);

    // 予定が変わったらlocalStorageに保存
    useEffect(() => {
        const key = getStorageKey(year, month);
        localStorage.setItem(key, JSON.stringify(plans));
    }, [plans, year, month]);

    const handlePlanChange = (day: number, value: string) => {
        setPlans((prev) => ({ ...prev, [day]: value }));
    };

    const prevMonth = () => {
        if (month === 0) {
            setYear(year - 1);
            setMonth(11);
        } else {
            setMonth(month - 1);
        }
    };

    const nextMonth = () => {
        if (month === 11) {
            setYear(year + 1);
            setMonth(0);
        } else {
            setMonth(month + 1);
        }
    };

    return (
        <div>
            <h2>{year}年{month + 1}月のカレンダー</h2>
            <button onClick={prevMonth}>前の月</button>
            <button onClick={nextMonth} style={{ marginLeft: "1rem" }}>次の月</button>
            <table style={{ width: "100%", marginTop: "1rem", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>日</th>
                        <th>予定</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                        <tr key={i + 1}>
                            <td style={{ border: "1px solid #ccc", width: "3rem", textAlign: "center" }}>{i + 1}日</td>
                            <td style={{ border: "1px solid #ccc" }}>
                                <input
                                    type="text"
                                    value={plans[i + 1] || ""}
                                    onChange={(e) => handlePlanChange(i + 1, e.target.value)}
                                    style={{ width: "90%" }}
                                    placeholder="予定を入力"
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar; 