import React, { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Info } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Button } from '../ui/button';

interface NotificationSettings {
    productUpdates: boolean
    comments: boolean
    checkoutProduct: boolean
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<NotificationSettings>({
        productUpdates: true,
        comments: false,
        checkoutProduct: true,
    })

    const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
        setNotifications((prev) => ({ ...prev, [key]: value }))
    }

    const handleSave = () => {
        // Handle save functionality based on active section
        // console.log("Saving settings for:", activeSection)
        // Add your save logic here
    }

    return (
        <div>
            <div className="flex items-center gap-2 border-b border-[#F6F6F6] pb-6 mb-6">
                <h1 className="text-lg font-medium text-[#30373D]">Notification</h1>
                <Tooltip>
                    <TooltipTrigger>
                        <Info className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Manage your notification preferences</p>
                    </TooltipContent>
                </Tooltip>
            </div>

            <Card className='p-0'>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="product-updates" className="text-sm font-medium text-[#30373D]">
                                Product updates
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Get notified about new product features</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Switch
                            id="product-updates"
                            checked={notifications.productUpdates}
                            onCheckedChange={(checked) => handleNotificationChange("productUpdates", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="comments" className="text-sm font-medium text-[#30373D]">
                                Comments
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Get notified about new comments</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Switch
                            id="comments"
                            checked={notifications.comments}
                            onCheckedChange={(checked) => handleNotificationChange("comments", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Label htmlFor="checkout-product" className="text-sm font-medium text-[#30373D]">
                                Checkout Product
                            </Label>
                            <Tooltip>
                                <TooltipTrigger>
                                    <Info className="h-4 w-4 text-gray-400" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Get notified about checkout updates</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <Switch
                            id="checkout-product"
                            checked={notifications.checkoutProduct}
                            onCheckedChange={(checked) => handleNotificationChange("checkoutProduct", checked)}
                        />
                    </div>
                </CardContent>
            </Card>

            <Button onClick={handleSave} className="bg-[#FF6B00] hover:bg-[#FF6B0080] text-white px-8 mt-6">
                Save
            </Button>
        </div>
    );
};

export default Notifications;