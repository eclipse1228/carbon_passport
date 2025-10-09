'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Search, QrCode, Hash, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PassportLookupPage({ params }: { params: { locale: string } }) {
  const router = useRouter()
  const [searchType, setSearchType] = useState<'id' | 'qr'>('id')
  const [searchValue, setSearchValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      setError('검색어를 입력해주세요.')
      return
    }

    setIsSearching(true)
    setError('')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For demo purposes, redirect to a sample passport
      if (searchValue.toLowerCase().includes('abc123') || searchValue.includes('12345')) {
        router.push(`/${params.locale}/passport/view/abc123def456`)
      } else {
        setError('해당 여권을 찾을 수 없습니다. 여권 ID나 QR 코드를 다시 확인해주세요.')
      }
    } catch (err) {
      setError('검색 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleQRScan = () => {
    // This would open camera or QR scanner
    alert('QR 코드 스캔 기능은 개발 중입니다.')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${params.locale}`} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
              <ArrowLeft className="h-5 w-5" />
              <span>돌아가기</span>
            </Link>
            <div className="flex items-center space-x-2">
              <Search className="h-6 w-6 text-blue-600" />
              <span className="font-semibold text-gray-800">여권 조회</span>
            </div>
            <div></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Main Search Card */}
          <Card className="shadow-xl">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                탄소 여권 조회
              </CardTitle>
              <p className="text-gray-600">
                여권 ID나 QR 코드로 탄소 여권을 조회할 수 있습니다
              </p>
            </CardHeader>

            <CardContent className="p-8">
              {/* Search Type Selector */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setSearchType('id')}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    searchType === 'id'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Hash className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">여권 ID</div>
                  <div className="text-sm text-gray-500">숫자와 문자 조합</div>
                </button>
                
                <button
                  onClick={() => setSearchType('qr')}
                  className={`p-4 rounded-lg border-2 transition-all text-center ${
                    searchType === 'qr'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <QrCode className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-medium">QR 코드</div>
                  <div className="text-sm text-gray-500">카메라 스캔</div>
                </button>
              </div>

              {/* Search Input */}
              {searchType === 'id' ? (
                <div className="space-y-4">
                  <Label htmlFor="passport-id" className="text-lg font-medium">
                    여권 ID 입력
                  </Label>
                  <Input
                    id="passport-id"
                    type="text"
                    placeholder="예: abc123def456"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="text-lg p-4 border-2 border-gray-200 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <p className="text-sm text-gray-500">
                    여권 생성 완료 시 제공된 고유 ID를 입력하세요
                  </p>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="h-24 w-24 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">QR 코드 스캔</h3>
                  <p className="text-gray-500 mb-6">
                    여권에 있는 QR 코드를 스캔하여 조회하세요
                  </p>
                  <Button 
                    onClick={handleQRScan}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <QrCode className="h-5 w-5 mr-2" />
                    QR 코드 스캔하기
                  </Button>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Search Button */}
              {searchType === 'id' && (
                <div className="mt-6">
                  <Button 
                    onClick={handleSearch}
                    disabled={isSearching || !searchValue.trim()}
                    className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-lg"
                  >
                    {isSearching ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        검색 중...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        여권 조회하기
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Sample Data Card */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg text-blue-800">
                🧪 데모 체험하기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 mb-4">
                샘플 여권을 확인해보세요!
              </p>
              <div className="space-y-2 text-sm">
                <p><strong>샘플 여권 ID:</strong> abc123def456</p>
                <p><strong>또는:</strong> 12345</p>
              </div>
              <Button 
                onClick={() => {
                  setSearchValue('abc123def456')
                  handleSearch()
                }}
                variant="outline"
                className="mt-4 border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                샘플 여권 보기
              </Button>
            </CardContent>
          </Card>

          {/* Help Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">도움말</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm text-gray-600">
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">여권 ID를 찾을 수 없나요?</h4>
                  <p>여권 생성 완료 페이지나 이메일에서 여권 ID를 확인할 수 있습니다.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">QR 코드 스캔이 안 되나요?</h4>
                  <p>카메라 권한을 허용하고, 조명이 충분한 곳에서 다시 시도해보세요.</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800 mb-1">새 여권을 만들고 싶나요?</h4>
                  <Link href={`/${params.locale}/passport/form`} className="text-blue-600 hover:underline">
                    여기를 클릭하여 새 여권을 만드세요 →
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}