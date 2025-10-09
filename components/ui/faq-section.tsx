'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { ChevronDown, ChevronUp, HelpCircle, Train, Leaf, Users, Target, Recycle, FileText } from 'lucide-react'

const getFaqData = (locale: string) => {
  if (locale === 'en') {
    return [
      {
        id: 1,
        icon: Train,
        question: "Are railways really more eco-friendly than passenger cars?",
        answer: "Yes, absolutely. For example, on the Seoul-Busan route, passenger cars emit about 60.2kgCO₂e while ITX-Saemaeul emits only about 11.4kgCO₂e. This represents **81% fewer greenhouse gas** emissions, showing that railways emit only 1/9 the level of greenhouse gases compared to passenger cars, making them a truly eco-friendly transportation mode.",
        category: "Environment"
      },
      {
        id: 2,
        icon: Target,
        question: "What is KORAIL's carbon neutrality plan?",
        answer: "KORAIL aims to achieve **carbon neutrality (Net Zero) by 2050**. To achieve this, we are implementing plans to reduce approximately 1.5 million tons of CO₂e emissions annually, executing various reduction activities including introducing eco-friendly vehicles, expanding renewable energy, and improving energy efficiency.",
        category: "Goals"
      },
      {
        id: 3,
        icon: Leaf,
        question: "What eco-friendly vehicles is KORAIL transitioning to?",
        answer: "KORAIL plans to **completely retire all diesel passenger locomotives by 2029** and replace them with eco-friendly vehicles such as KTX-Eum and hydrogen electric trains. Currently, 78.5% of our fleet consists of eco-friendly vehicles, and we are continuously expanding the introduction of emission-free vehicles including electric and hydrogen trains.",
        category: "Technology"
      },
      {
        id: 4,
        icon: Users,
        question: "What is the scale of KORAIL's social support?",
        answer: "KORAIL provides hundreds of billions of won annually in **discounts and free rides for disabled individuals, national merit recipients, children, and elderly passengers**. As of 2024, approximately **52.29 million people have used** these services, greatly contributing to transportation welfare, and we provide services to 1.25 million transportation welfare beneficiaries.",
        category: "Social"
      },
      {
        id: 5,
        icon: Recycle,
        question: "What environmental protection activities does KORAIL conduct?",
        answer: "KORAIL promotes various resource circulation and renewable energy activities. As of 2023, we **recycled 4,034 tons out of 4,964 tons of business site waste** (81.3%), and installed solar power generation facilities at station sites nationwide, raising our renewable energy usage rate to 34.2%. This significantly contributes to achieving RE100.",
        category: "Environment"
      },
      {
        id: 6,
        icon: FileText,
        question: "Where can I find KORAIL's ESG information?",
        answer: "KORAIL publishes an annual **Sustainability Management Report** to transparently disclose detailed data on greenhouse gases, air quality, waste, and renewable energy to the public. With a management transparency index of 95.7 points, you can check ESG performance in real-time through our official website and the Carbon Passport platform.",
        category: "Information"
      }
    ]
  } else if (locale === 'ja') {
    return [
      {
        id: 1,
        icon: Train,
        question: "鉄道は本当に乗用車よりも環境に優しいのですか？",
        answer: "はい、その通りです。ソウル〜釜山区間を例にすると、乗用車は約60.2kgCO₂eを排出しますが、ITX-セマウルは約11.4kgCO₂eしか排出しません。これは約**81%少ない温室効果ガス**を排出することで、鉄道が乗用車比1/9レベルの温室効果ガスしか排出しない環境にやさしい交通手段であることを示しています。",
        category: "環境"
      },
      {
        id: 2,
        icon: Target,
        question: "KORAILのカーボンニュートラル計画は何ですか？",
        answer: "KORAILは**2050年までにカーボンニュートラル（Net Zero）達成**を目標としています。このために毎年約150万トンのCO₂e排出量を削減する計画を推進しており、環境にやさしい車両導入、再生可能エネルギーの拡大、エネルギー効率の改善など様々な削減活動を実行しています。",
        category: "目標"
      },
      {
        id: 3,
        icon: Leaf,
        question: "KORAILはどんな環境にやさしい車両に変えていますか？",
        answer: "KORAILは**2029年までにディーゼル旅客機関車を全量廃車**し、KTX-イウム、水素電気動車のような環境にやさしい車両に交換する予定です。現在、環境にやさしい車両比率が78.5%に達しており、継続的に電気動車や水素動車など無公害車両の導入を拡大しています。",
        category: "技術"
      },
      {
        id: 4,
        icon: Users,
        question: "KORAILの社会的支援規模はどの程度ですか？",
        answer: "KORAILは毎年**障害者、国家有功者、子ども、高齢者の割引・無料**特典で数千億ウォン規模を支援しています。2024年基準約**5,229万人が利用**して交通福祉実現に大きく貢献しており、125万人の交通福祉受益者にサービスを提供しています。",
        category: "社会"
      },
      {
        id: 5,
        icon: Recycle,
        question: "KORAILはどんな環境保護活動をしていますか？",
        answer: "KORAILは様々な資源循環および再生可能エネルギー活動を推進しています。2023年基準**事業場廃棄物4,964トンのうち4,034トンをリサイクル**（81.3%）し、全国駅舎敷地に太陽光発電設備を設置して再生可能エネルギー使用率を34.2%まで引き上げました。これはRE100達成に大きく貢献しています。",
        category: "環境"
      },
      {
        id: 6,
        icon: FileText,
        question: "KORAILのESG情報はどこで確認できますか？",
        answer: "KORAILは毎年**持続可能経営報告書**を発刊して温室効果ガス、大気質、廃棄物、再生可能エネルギーなど詳細データを国民に透明に公開しています。経営透明性指数95.7点を記録し、公式ホームページとカーボンパスポートプラットフォームを通じてリアルタイムでESG成果を確認できます。",
        category: "情報"
      }
    ]
  } else if (locale === 'zh-CN') {
    return [
      {
        id: 1,
        icon: Train,
        question: "铁路真的比私家车更环保吗？",
        answer: "是的，绝对如此。以首尔-釜山线路为例，私家车排放约60.2kgCO₂e，而ITX-新村号仅排放约11.4kgCO₂e。这意味着**减少81%的温室气体**排放，表明铁路仅产生私家车1/9水平的温室气体，是真正的环保交通工具。",
        category: "环境"
      },
      {
        id: 2,
        icon: Target,
        question: "KORAIL的碳中和计划是什么？",
        answer: "KORAIL的目标是**到2050年实现碳中和（Net Zero）**。为此，我们正在实施每年减少约150万吨CO₂e排放的计划，包括引入环保车辆、扩大可再生能源、提高能源效率等各种减排活动。",
        category: "目标"
      },
      {
        id: 3,
        icon: Leaf,
        question: "KORAIL正在转向什么样的环保车辆？",
        answer: "KORAIL计划**到2029年全部淘汰柴油客运机车**，并用KTX-Eum、氢电动车等环保车辆替代。目前环保车辆比例达到78.5%，我们正在持续扩大电动车和氢动车等零排放车辆的引入。",
        category: "技术"
      },
      {
        id: 4,
        icon: Users,
        question: "KORAIL的社会支持规模有多大？",
        answer: "KORAIL每年为**残疾人、国家功臣、儿童、老年乘客**提供数千亿韩元规模的折扣和免费乘车优惠。截至2024年约有**5229万人次使用**这些服务，为实现交通福利做出了巨大贡献，为125万交通福利受益者提供服务。",
        category: "社会"
      },
      {
        id: 5,
        icon: Recycle,
        question: "KORAIL开展哪些环保活动？",
        answer: "KORAIL推进各种资源循环和可再生能源活动。截至2023年，**在4964吨营业场所废物中回收了4034吨**（81.3%），并在全国车站场地安装太阳能发电设施，将可再生能源使用率提高到34.2%。这对实现RE100贡献巨大。",
        category: "环境"
      },
      {
        id: 6,
        icon: FileText,
        question: "在哪里可以查看KORAIL的ESG信息？",
        answer: "KORAIL每年发布**可持续经营报告**，向公众透明公开温室气体、空气质量、废物、可再生能源等详细数据。经营透明度指数达到95.7分，可通过官方网站和碳护照平台实时查看ESG成果。",
        category: "信息"
      }
    ]
  } else if (locale === 'zh-TW') {
    return [
      {
        id: 1,
        icon: Train,
        question: "鐵路真的比私家車更環保嗎？",
        answer: "是的，絕對如此。以首爾-釜山線路為例，私家車排放約60.2kgCO₂e，而ITX-新村號僅排放約11.4kgCO₂e。這意味著**減少81%的溫室氣體**排放，表明鐵路僅產生私家車1/9水平的溫室氣體，是真正的環保交通工具。",
        category: "環境"
      },
      {
        id: 2,
        icon: Target,
        question: "KORAIL的碳中和計劃是什麼？",
        answer: "KORAIL的目標是**到2050年實現碳中和（Net Zero）**。為此，我們正在實施每年減少約150萬噸CO₂e排放的計劃，包括引入環保車輛、擴大再生能源、提高能源效率等各種減排活動。",
        category: "目標"
      },
      {
        id: 3,
        icon: Leaf,
        question: "KORAIL正在轉向什麼樣的環保車輛？",
        answer: "KORAIL計劃**到2029年全部淘汰柴油客運機車**，並用KTX-Eum、氫電動車等環保車輛替代。目前環保車輛比例達到78.5%，我們正在持續擴大電動車和氫動車等零排放車輛的引入。",
        category: "技術"
      },
      {
        id: 4,
        icon: Users,
        question: "KORAIL的社會支持規模有多大？",
        answer: "KORAIL每年為**殘疾人、國家功臣、兒童、老年乘客**提供數千億韓元規模的折扣和免費乘車優惠。截至2024年約有**5229萬人次使用**這些服務，為實現交通福利做出了巨大貢獻，為125萬交通福利受益者提供服務。",
        category: "社會"
      },
      {
        id: 5,
        icon: Recycle,
        question: "KORAIL開展哪些環保活動？",
        answer: "KORAIL推進各種資源循環和再生能源活動。截至2023年，**在4964噸營業場所廢物中回收了4034噸**（81.3%），並在全國車站場地安裝太陽能發電設施，將再生能源使用率提高到34.2%。這對實現RE100貢獻巨大。",
        category: "環境"
      },
      {
        id: 6,
        icon: FileText,
        question: "在哪裡可以查看KORAIL的ESG資訊？",
        answer: "KORAIL每年發布**可持續經營報告**，向公眾透明公開溫室氣體、空氣品質、廢物、再生能源等詳細資料。經營透明度指數達到95.7分，可透過官方網站和碳護照平台即時查看ESG成果。",
        category: "資訊"
      }
    ]
  }
  
  return [
    {
      id: 1,
      icon: Train,
      question: "철도가 정말 승용차보다 친환경적인가요?",
      answer: "네, 맞습니다. 서울-부산 구간을 예로 들면, 승용차는 약 60.2kgCO₂e를 배출하지만 ITX-새마을은 약 11.4kgCO₂e만 배출합니다. 이는 약 **81% 적은 온실가스**를 배출하는 것으로, 철도가 승용차 대비 1/9 수준의 온실가스만 배출하는 친환경 교통수단임을 보여줍니다.",
      category: "환경"
    },
    {
      id: 2,
      icon: Target,
      question: "코레일의 탄소중립 계획은 무엇인가요?",
      answer: "코레일은 **2050년까지 탄소중립(Net Zero) 달성**을 목표로 하고 있습니다. 이를 위해 매년 약 150만 톤 CO₂e 배출량을 줄이는 계획을 추진하고 있으며, 친환경 차량 도입, 재생에너지 확대, 에너지 효율 개선 등 다양한 감축 활동을 실행하고 있습니다.",
      category: "목표"
    },
    {
      id: 3,
      icon: Leaf,
      question: "코레일은 어떤 친환경 차량으로 바꾸고 있나요?",
      answer: "코레일은 **2029년까지 디젤 여객기관차를 전량 폐차**하고, KTX-이음, 수소전기동차 같은 친환경 차량으로 교체할 예정입니다. 현재 친환경 차량 비율이 78.5%에 달하며, 지속적으로 전기동차와 수소동차 등 무공해 차량 도입을 확대하고 있습니다.",
      category: "기술"
    },
    {
      id: 4,
      icon: Users,
      question: "코레일의 사회적 지원 규모는 어느 정도인가요?",
      answer: "코레일은 매년 **장애인, 국가유공자, 어린이, 경로 승객**의 할인·무임 혜택으로 수천억 원 규모를 지원하고 있습니다. 2024년 기준 약 **5,229만 명이 이용**하여 교통복지 실현에 크게 기여하고 있으며, 125만 명의 교통복지 수혜자에게 서비스를 제공하고 있습니다.",
      category: "사회"
    },
    {
      id: 5,
      icon: Recycle,
      question: "코레일은 어떤 환경보호 활동을 하고 있나요?",
      answer: "코레일은 다양한 자원순환 및 재생에너지 활동을 추진하고 있습니다. 2023년 기준 **사업장 폐기물 4,964톤 중 4,034톤을 재활용**(81.3%)했으며, 전국 역사 부지에 태양광 발전 설비를 설치해 재생에너지 사용률을 34.2%까지 끌어올렸습니다. 이는 RE100 달성에 크게 기여하고 있습니다.",
      category: "환경"
    },
    {
      id: 6,
      icon: FileText,
      question: "코레일의 ESG 정보는 어디서 확인할 수 있나요?",
      answer: "코레일은 매년 **지속가능경영 보고서**를 발간하여 온실가스, 공기질, 폐기물, 재생에너지 등 세부 데이터를 국민에게 투명하게 공개하고 있습니다. 경영 투명성 지수 95.7점을 기록하며, 공식 홈페이지와 탄소 여권 플랫폼을 통해 실시간으로 ESG 성과를 확인할 수 있습니다.",
      category: "정보"
    }
  ]
}

const categoryColors = {
  "환경": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "목표": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "기술": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "사회": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "정보": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "Environment": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "Goals": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "Technology": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "Social": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "Information": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "環境": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "目標": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "技術": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "社会": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "情報": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  // 중국어 간체
  "环境": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "目标": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "技术": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "社会": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "信息": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  // 중국어 번체
  "環境": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "目標": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "技術": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]",
  "社會": "from-[#00afd5]/10 to-[#00afd5]/20 text-[#00afd5]",
  "資訊": "from-[#0054a6]/10 to-[#0054a6]/20 text-[#0054a6]"
}

// 마크다운 **bold** 문법을 HTML로 변환하는 함수
function formatAnswer(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong className="font-bold text-[#0054a6]">$1</strong>')
}

interface FaqSectionProps {
  locale?: string
}

export function FaqSection({ locale = 'ko' }: FaqSectionProps) {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-[#2dafdd]/10 to-[#2dafdd]/20 rounded-full">
              <HelpCircle className="h-8 w-8 text-[#2dafdd]" />
            </div>
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            {locale === 'en' 
              ? 'Frequently Asked Questions' 
              : locale === 'zh-CN' 
              ? '常见问题' 
              : locale === 'zh-TW'
              ? '常見問題'
              : locale === 'ja'
              ? 'よくある質問'
              : '자주 묻는 질문'
            }
          </h2>
          <p className="text-xl text-slate-600">
            {locale === 'en' 
              ? 'Check out answers to common questions about KORAIL ESG activities' 
              : locale === 'zh-CN'
              ? '了解KORAIL ESG活动的相关问题答案'
              : locale === 'zh-TW'
              ? '了解KORAIL ESG活動的相關問題答案'
              : locale === 'ja'
              ? 'KORAIL ESG活動に関するよくある質問の答えを確認'
              : '코레일 ESG 활동에 대해 궁금한 점들을 확인해보세요'
            }
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {getFaqData(locale).map((faq) => {
            const isOpen = openItems.includes(faq.id)
            const IconComponent = faq.icon
            
            return (
              <Card 
                key={faq.id} 
                className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white overflow-hidden"
              >
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-[#2dafdd]/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        <div className={`p-3 bg-gradient-to-br ${categoryColors[faq.category as keyof typeof categoryColors]} rounded-full`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 mb-1">
                          {faq.question}
                        </h3>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r ${categoryColors[faq.category as keyof typeof categoryColors]} border`}>
                          {faq.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 ml-4">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-slate-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                {isOpen && (
                  <CardContent className="px-6 pb-6 pt-0">
                    <div className="ml-16 pl-4 border-l-2 border-slate-100">
                      <p 
                        className="text-slate-600 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatAnswer(faq.answer) }}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
            )
          })}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-slate-500 mb-4">
            {locale === 'en' ? 'Have more questions?' : '더 궁금한 점이 있으신가요?'}
          </p>
          <div className="flex items-center justify-center space-x-2 text-[#2dafdd] hover:text-[#2dafdd]/80 transition-colors">
            <FileText className="h-5 w-5" />
            <span className="font-medium">
              {locale === 'en' 
                ? 'Check our Sustainability Management Report for more detailed information'
                : '지속가능경영 보고서에서 더 자세한 정보를 확인하세요'
              }
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}