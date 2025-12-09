'use client'

import Dashboard from '@/components/ui/Dashboard'
import { useDispatch, useSelector } from 'react-redux'
import { RootState, AppDispatch } from '@/store/store'
import { useEffect } from 'react'
import { fetchDashboard } from '@/store/slices/dashboardSlice'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { dashboard: { data, loading, error } } = useSelector((state: RootState) => state)

  useEffect(() => {
      if (user?.token) {
        dispatch(fetchDashboard(user.token))
      }
    }, [dispatch, user?.token])

    console.log('data', data)

  return (
    <div className="">
      <Dashboard data={data} loading={loading} />
    </div>
  )
}
