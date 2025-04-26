/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react'
import { Document, PDFViewer, Page, Text, View, Font } from '@react-pdf/renderer'
import ReactPDFChart from 'react-pdf-charts'
import { CartesianGrid, BarChart, Legend, Bar, XAxis, YAxis } from 'recharts'
import { LineChart, Line } from 'recharts'
import { PieChart, Pie, Cell } from 'recharts'

Font.register({ family: 'NotoSansJP', fonts: [{ src: '../fonts/NotoSansJP-Regular.ttf' }, { src: '../fonts/NotoSansJP-Bold.ttf', fontWeight: 'bold' }] })
// https://github.com/diegomura/react-pdf/issues/419#issuecomment-1161308596
Font.registerHyphenationCallback((word) => Array.from(word).flatMap((char) => [char, '']))

const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
  <View wrap={false} style={{ marginBottom: 30 }}>
    <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4 }}>{title}</Text>
    {subtitle && <Text style={{ fontSize: 11, color: 'gray', marginBottom: 10 }}>{subtitle}</Text>}
    <View style={{ padding: 10 }}>{children}</View>
  </View>
)

const BasicTable = ({ columns, data }: any) => {
  const calculateNormalizedWidths = () => {
    const specifiedWidths = columns.map((col: any) => {
      const width = col.width ? parseFloat(col.width) : null
      return width
    })

    const totalSpecified = specifiedWidths.reduce((sum: number, w: number) => (w !== null ? sum + w : sum), 0)
    const unspecifiedCount = specifiedWidths.filter((w: number) => w === null).length

    let widths: string[] = []

    if (totalSpecified > 100) {
      // 正規化（すべての幅を比率で調整）
      widths = specifiedWidths.map((w: number) => {
        const normalized = ((w ?? 100 / unspecifiedCount) / totalSpecified) * 100
        return `${normalized.toFixed(2)}%`
      })
    } else {
      // 足りない幅を未指定列に均等配分
      const remaining = 100 - totalSpecified
      const autoWidth = unspecifiedCount > 0 ? remaining / unspecifiedCount : 0
      widths = specifiedWidths.map((w: number) => `${(w ?? autoWidth).toFixed(2)}%`)
    }

    return widths
  }

  const widths = calculateNormalizedWidths()

  const PTable = ({ children }: { children: ReactNode }) => (
    <View wrap={false} style={{ width: '100%', marginBottom: 10 }}>
      {children}
    </View>
  )
  const PTableHead = ({ children }: { children: ReactNode }) => (
    <View style={{ flexDirection: 'row', backgroundColor: '#f0f0f0', fontWeight: 'bold' }}>{children}</View>
  )
  const PTableBody = ({ children }: { children: ReactNode }) => <View>{children}</View>
  const PTableRow = ({ children, index }: { children: ReactNode; index?: number }) => (
    <View style={{ flexDirection: 'row', backgroundColor: index !== undefined && index % 2 === 1 ? '#fafafa' : 'white' }}>{children}</View>
  )
  const PTableCell = ({ children, width }: { children: ReactNode; width: string }) => (
    <Text style={{ width, borderWidth: 0.5, borderColor: '#ccc', textAlign: 'center', paddingVertical: 5, paddingHorizontal: 3 }}>{children}</Text>
  )

  return (
    <PTable>
      <PTableHead>
        {columns.map((col: any, index: number) => (
          <PTableCell key={index} width={widths[index]}>
            {col.header}
          </PTableCell>
        ))}
      </PTableHead>
      <PTableBody>
        {data.map((row: any, rowIndex: number) => (
          <PTableRow key={rowIndex} index={rowIndex}>
            {columns.map((col: any, colIndex: number) => (
              <PTableCell key={colIndex} width={widths[colIndex]}>
                {row[col.accessor]}
              </PTableCell>
            ))}
          </PTableRow>
        ))}
      </PTableBody>
    </PTable>
  )
}

const Table1 = () => {
  const columns = [
    { header: '概要', accessor: 'name', width: '30%' },
    { header: '数量', accessor: 'surface', width: '10%' },
    { header: '単位', accessor: 'thickness', width: '10%' },
    { header: '単価', accessor: 'width', width: '25%' },
    { header: '金額', accessor: 'length', width: '25%' }
  ]
  const data = [
    { name: 'サンプル1', surface: '1', thickness: '式', width: '10,000', length: '10,000' },
    { name: 'サンプル1', surface: '1', thickness: '式', width: '10,000', length: '10,000' },
    { name: 'サンプル1', surface: '1', thickness: '式', width: '10,000', length: '10,000' },
    { name: 'サンプル1', surface: '1', thickness: '式', width: '10,000', length: '10,000' },
    { name: 'サンプル1', surface: '1', thickness: '式', width: '10,000', length: '10,000' },
    { name: 'サンプル1', surface: '1', thickness: '式', width: '10,000', length: '10,000' }
  ]

  return <BasicTable columns={columns} data={data} />
}

const BarChart1 = () => {
  const data2 = [
    { name: 'A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'G', uv: 3490, pv: 4300, amt: 2100 }
  ]
  return (
    <ReactPDFChart>
      <BarChart width={500} height={250} data={data2}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar isAnimationActive={false} dataKey="pv" fill="#8884d8" />
        <Bar isAnimationActive={false} dataKey="uv" fill="#82ca9d" />
      </BarChart>
    </ReactPDFChart>
  )
}

const LineChart1 = () => {
  const data = [
    { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
    { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
    { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
    { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
    { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
    { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
    { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 }
  ]
  return (
    <ReactPDFChart>
      <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Line isAnimationActive={false} type="monotone" dataKey="pv" stroke="#8884d8" />
        <Line isAnimationActive={false} type="monotone" dataKey="uv" stroke="#82ca9d" />
      </LineChart>
    </ReactPDFChart>
  )
}

const PieChart1 = () => {
  const data = [
    { name: '項目A', value: 400 },
    { name: '項目B', value: 300 },
    { name: '項目C', value: 300 },
    { name: '項目D', value: 200 }
  ]
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  return (
    <ReactPDFChart>
      <PieChart width={200} height={200}>
        <Pie isAnimationActive={false} data={data} cx={100} cy={100} innerRadius={40} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
          {data.map((_entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ReactPDFChart>
  )
}

const PieAndTable1 = () => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
      <View style={{ width: '50%' }}>
        <Table1 />
      </View>
      <View style={{ width: '45%' }}>
        <PieChart1 />
      </View>
    </View>
  )
}

// 5分ごと×24時間＝288件の送受信データを生成
const generateNetworkTrafficData = () => {
  const data = []
  for (let i = 0; i < 288; i++) {
    const hour = Math.floor(i / 12)
    const min = (i % 12) * 5
    const label = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`

    const isPeak = (hour > 8 || (hour === 8 && min >= 30)) && (hour < 18 || (hour === 18 && min === 0))
    const weight = isPeak ? 1 : 0.4

    data.push({
      time: label,
      upload: (Math.random() * 5 + 1) * weight,
      download: (Math.random() * 10 + 5) * weight
    })
  }
  return data
}

const NetworkTrafficChart = () => {
  const data = generateNetworkTrafficData()

  return (
    <ReactPDFChart>
      <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" interval={23} /> {/* 2時間ごとにラベル表示 */}
        <YAxis />
        <Legend />
        <Line isAnimationActive={false} type="monotone" dataKey="upload" stroke="#82ca9d" dot={false} />
        <Line isAnimationActive={false} type="monotone" dataKey="download" stroke="#8884d8" dot={false} />
      </LineChart>
    </ReactPDFChart>
  )
}

const generateMonthlyTrafficData = () => {
  const data = []
  const daysInMonth = 30 // 1ヶ月（30日）
  for (let day = 1; day <= daysInMonth; day++) {
    for (let hour = 0; hour < 24; hour++) {
      const isWeekend = [6, 0].includes(new Date(2025, 3, day).getDay()) // 土日判定（6=土、0=日）
      const time = `${String(hour).padStart(2, '0')}:00`
      const upload = isWeekend ? Math.random() * 3 : Math.random() * 3 // 土日は少なめ
      const download = isWeekend ? Math.random() * 3 : Math.random() * 5 // 土日は少なめ
      data.push({
        date: `2025/04/${String(day).padStart(2, '0')}`,
        time,
        upload: upload.toFixed(2),
        download: download.toFixed(2)
      })
    }
  }
  return data
}

const MonthlyTrafficChart = () => {
  const data = generateMonthlyTrafficData()

  return (
    <ReactPDFChart>
      <LineChart width={500} height={250} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" interval={240} /> {/* 日付を表示、重ならないように調整 */}
        <YAxis />
        <Legend />
        <Line isAnimationActive={false} type="monotone" dataKey="upload" stroke="#82ca9d" dot={false} />
        <Line isAnimationActive={false} type="monotone" dataKey="download" stroke="#8884d8" dot={false} />
      </LineChart>
    </ReactPDFChart>
  )
}

const MyDocument = () => {
  const data = { value: '2025/04/28' }
  return (
    <Document>
      <Page style={{ padding: 30, fontSize: 11, fontFamily: 'NotoSansJP' }} size="A4">
        <Text style={{ fontSize: 12, marginBottom: 20, textAlign: 'center', color: 'grey' }} fixed>
          ~ ページヘッダサンプル ~
        </Text>
        <View>
          <Text style={{ fontSize: 24, marginBottom: 0, fontWeight: 'bold', textAlign: 'center' }}>月次レポート</Text>
        </View>
        <View style={{ marginBottom: 30, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column' }}>
            <Text>株式会社〇〇</Text>
            <Text>〇〇 御中</Text>
          </View>
          <View>
            <Text>発行日 {data.value}</Text>
            <View style={{ marginTop: 10 }}>
              <Text>株式会社〇〇</Text>
              <Text>千葉県〇〇〇〇〇〇〇</Text>
              <Text>TEL: 00-0000-0000</Text>
            </View>
          </View>
        </View>
        <Section title="テーブル１" subtitle="テーブル表示のサンプルです。">
          <Table1 />
        </Section>
        <Section title="グラフ１（折れ線）" subtitle="折れ線グラフのサンプルです。">
          <LineChart1 />
        </Section>
        <Section title="グラフ２（棒グラフ）" subtitle="棒グラフのサンプルです。">
          <BarChart1 />
        </Section>
        <Section title="グラフ３（円グラフ）" subtitle="円グラフのサンプルです。">
          <PieChart1 />
        </Section>
        <Section title="グラフ４（円グラフ＋表）" subtitle="円グラフと表をあわせて表示する場合のサンプルです。">
          <PieAndTable1 />
        </Section>
        <Section title="グラフ３（送受信量）" subtitle="1日間の5分ごとの通信データ">
          <NetworkTrafficChart />
        </Section>
        <Section title="グラフ４（1ヶ月間の送受信量）" subtitle="1時間ごとのデータ">
          <MonthlyTrafficChart />
        </Section>
        <Section title="まとめ">
          <Text>
            本レポートでは、過去1ヶ月間の主要な業務指標と成果について報告しました。
            折れ線グラフや棒グラフを通じてトレンドを視覚化し、円グラフおよび表で具体的な内訳を示しました。
          </Text>
          <Text>今後の改善点としては、〇〇業務の効率化および△△の品質向上が挙げられます。 引き続き、関係者一同で課題解決に取り組んでまいります。</Text>
        </Section>
        <Text
          style={{ position: 'absolute', fontSize: 12, bottom: 30, left: 0, right: 0, textAlign: 'center', color: 'grey' }}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  )
}

const PDF = () => (
  <div>
    <h1>React PDF Sample</h1>
    <PDFViewer height="1200" width="800">
      <MyDocument />
    </PDFViewer>
  </div>
)

export default PDF
