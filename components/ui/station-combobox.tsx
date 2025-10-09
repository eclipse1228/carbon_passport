"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { STATIONS, type StationData, searchStations } from "@/lib/constants/stations"

interface StationComboboxProps {
  value?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  className?: string
  locale?: 'ko' | 'en' | 'ja' | 'zh'
  disabled?: boolean
}

export function StationCombobox({
  value,
  onValueChange,
  placeholder = "역을 선택하세요...",
  className,
  locale = 'ko',
  disabled = false,
}: StationComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")

  // Get the selected station for display
  const selectedStation = React.useMemo(() => {
    return STATIONS.find((station) => station.code === value)
  }, [value])

  // Filter stations based on search query
  const filteredStations = React.useMemo(() => {
    if (!searchQuery) return STATIONS
    return searchStations(searchQuery, locale)
  }, [searchQuery, locale])

  // Group stations by region for better organization
  const groupedStations = React.useMemo(() => {
    const groups: Record<string, StationData[]> = {}
    
    filteredStations.forEach((station) => {
      const region = station.region || 'other'
      if (!groups[region]) {
        groups[region] = []
      }
      groups[region].push(station)
    })
    
    return groups
  }, [filteredStations])

  const getStationDisplayName = (station: StationData) => {
    const nameField = `name_${locale}` as keyof StationData
    const name = station[nameField] as string | null
    return name || station.name_ko
  }

  const getRegionDisplayName = (region: string) => {
    const regionNames: Record<string, Record<string, string>> = {
      seoul: { ko: '서울', en: 'Seoul', ja: 'ソウル', zh: '首尔' },
      gyeonggi: { ko: '경기도', en: 'Gyeonggi', ja: '京畿道', zh: '京畿道' },
      incheon: { ko: '인천', en: 'Incheon', ja: '仁川', zh: '仁川' },
      gangwon: { ko: '강원도', en: 'Gangwon', ja: '江原道', zh: '江原道' },
      chungcheong: { ko: '충청도', en: 'Chungcheong', ja: '忠清道', zh: '忠清道' },
      jeolla: { ko: '전라도', en: 'Jeolla', ja: '全羅道', zh: '全罗道' },
      gyeongsang: { ko: '경상도', en: 'Gyeongsang', ja: '慶尚道', zh: '庆尚道' },
      jeju: { ko: '제주도', en: 'Jeju', ja: '済州島', zh: '济州岛' },
    }
    
    return regionNames[region]?.[locale] || region
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedStation ? getStationDisplayName(selectedStation) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="역명을 검색하세요..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList className="max-h-[300px]">
            <CommandEmpty>검색 결과가 없습니다.</CommandEmpty>
            {Object.entries(groupedStations).map(([region, stations]) => (
              <CommandGroup key={region} heading={getRegionDisplayName(region)}>
                {stations.map((station) => (
                  <CommandItem
                    key={station.code}
                    value={station.code}
                    onSelect={(currentValue) => {
                      onValueChange?.(currentValue === value ? "" : currentValue)
                      setOpen(false)
                      setSearchQuery("")
                    }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === station.code ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div>
                        <div className="font-medium">
                          {getStationDisplayName(station)}
                        </div>
                        {station.isKTX && (
                          <div className="text-xs text-blue-600 font-semibold">
                            KTX
                          </div>
                        )}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}