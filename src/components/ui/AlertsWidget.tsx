import React from 'react'
import Link from 'next/link'
import { AlertTriangle, CircleAlertIcon } from 'lucide-react'
import { Button } from './button'

const AlertsWidget: React.FC<{ notifications?: any[] }> = ({ notifications = [] }) => {
  // notifications expected to be an array from API; normalize fields if needed
  const items = (notifications || []).map((n: any, idx: number) => ({
    id: n.id ?? `n-${idx}`,
    // product: n.product_name ?? n.product ?? n.title ?? 'Unnamed',
    message: n.message ?? n.body ?? n.text ?? '',
    time: n.time ?? n.timestamp ?? n.createdAt ?? 'some time ago',
    priority: n.priority ?? 'low',
  }))

  if (items.length === 0) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground space-y-4">
        <CircleAlertIcon className="text-center mx-auto h-16 w-16" />
        <p className="text-lg font-semibold">No alerts</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-border">
      {items.map((alert) => (
        <div key={alert.id} className="p-4">
          <div className="flex items-start">
            <div className="mr-3 flex-shrink-0">
              <AlertTriangle
                className={`h-5 w-5 ${
                  alert.priority === 'high'
                    ? 'text-error'
                    : alert.priority === 'medium'
                    ? 'text-warning'
                    : 'text-info'
                }`}
              />
            </div>
            <div>
              {/* <p className="text-sm font-medium text-foreground">
                {alert.product}
              </p> */}
              <p className="text-sm text-muted-foreground">{alert.message}</p>
              <p className="mt-1 text-xs text-muted-foreground">{alert.time}</p>
            </div>
          </div>
        </div>
      ))}
      <div className="p-4 text-center">
        <Link href="/notifications">
          <Button color="primary">View all alerts</Button>
        </Link>
      </div>
    </div>
  )
}

export default AlertsWidget
