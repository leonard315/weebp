
'use client';

import { useMemo, useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useFirestore, useCollection, useUser } from '@/firebase';
import { useMemoFirebase } from '@/firebase/provider';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { CreditCard, Landmark, CircleDollarSign, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClientOnly } from '@/components/client-only';


type CartItem = {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    imageUrl: string;
    quantity: number;
};

function CheckoutForm() {
    const firestore = useFirestore();
    const { user } = useUser();

const paymentMethods = [
    { id: 'cod', title: 'Cash on Delivery', icon: CircleDollarSign },
    { id: 'card', title: 'Credit/Debit Card', icon: CreditCard },
    { id: 'gcash', title: 'GCash', icon: () => <span className="font-bold text-lg">G</span> },
    { id: 'bank', title: 'Bank Transfer', icon: Landmark },
]

    const router = useRouter();
    const { toast } = useToast();

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [paymentProofPreview, setPaymentProofPreview] = useState<string | null>(null);

    const cartItemsCollection = useMemoFirebase(
        () => (user ? collection(firestore, `users/${user.uid}/cartItems`) : null),
        [firestore, user]
    );
    const { data: cartItems } = useCollection<CartItem>(cartItemsCollection);

    const cartTotal = useMemo(() => {
        return cartItems?.reduce((total, item) => total + item.price * item.quantity, 0) || 0;
    }, [cartItems]);

    const handleProofUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPaymentProof(file);
            setPaymentProofPreview(URL.createObjectURL(file));
        }
    };
    
    // Reset proof when payment method changes
    const handlePaymentMethodChange = (value: string) => {
        setSelectedPaymentMethod(value);
        setPaymentProof(null);
        setPaymentProofPreview(null);
    }

    const handlePlaceOrder = async () => {
        if (!user || !cartItems || cartItems.length === 0 || !firestore) {
            toast({
                title: 'Error',
                description: 'Cannot place order. Your cart is empty or you are not signed in.',
                variant: 'destructive',
            });
            return;
        }

        const proofRequired = selectedPaymentMethod === 'gcash' || selectedPaymentMethod === 'bank';

        if (proofRequired && !paymentProof) {
             toast({
                title: 'Payment Proof Required',
                description: `Please upload a proof of your ${selectedPaymentMethod === 'gcash' ? 'GCash' : 'Bank'} payment to proceed.`,
                variant: 'destructive',
            });
            return;
        }
        
        setIsProcessing(true);

        try {
            // In a real app, you would upload the paymentProof to Firebase Storage
            // and save the URL in the order document. For this demo, we'll just proceed.
            const batch = writeBatch(firestore);
            const orderId = uuidv4();
            const orderRef = doc(firestore, 'orders', orderId);

            const orderData = {
                id: orderId,
                userId: user.uid,
                userEmail: user.email,
                items: cartItems,
                totalAmount: cartTotal,
                orderDate: serverTimestamp(),
                status: 'Pending',
                paymentMethod: paymentMethods.find(p => p.id === selectedPaymentMethod)?.title || 'Unknown',
                // In a real app, you'd have the URL from Firebase Storage here.
                paymentProofUrl: paymentProof ? `proof_${orderId}_${paymentProof.name}` : null
            };
            batch.set(orderRef, orderData);

            // Delete items from cart
            cartItems.forEach(item => {
                const cartItemRef = doc(firestore, `users/${user.uid}/cartItems`, item.id);
                batch.delete(cartItemRef);
            });

            await batch.commit();
            
            router.push(`/checkout/success?orderId=${orderId}`);

        } catch (error: any) {
            console.error("Order placement failed: ", error);
            toast({
                title: 'Order Failed',
                description: error.message || 'There was a problem placing your order.',
                variant: 'destructive',
            });
            setIsProcessing(false);
        }
    };
    
    const needsProof = selectedPaymentMethod === 'gcash' || selectedPaymentMethod === 'bank';
    const isPlaceOrderDisabled = isProcessing || (needsProof && !paymentProof);

    return (
        
            <ClientOnly>
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>
                <div className="grid md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Method</CardTitle>
                                <CardDescription>Select how you'd like to pay for your new car.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedPaymentMethod} onValueChange={handlePaymentMethodChange} className="grid md:grid-cols-2 gap-4">
                                    {paymentMethods.map((method) => (
                                    <Label key={method.id} htmlFor={method.id} className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer", {"border-primary": selectedPaymentMethod === method.id})}>
                                        <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                                        <method.icon className="mb-3 h-6 w-6" />
                                        {method.title}
                                    </Label>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>

                        {selectedPaymentMethod === 'card' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card Details</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="card-number">Card Number</Label>
                                            <Input id="card-number" placeholder="**** **** **** ****" />
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry">Expiry</Label>
                                                <Input id="expiry" placeholder="MM/YY" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvc">CVC</Label>
                                                <Input id="cvc" placeholder="123" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="zip">ZIP</Label>
                                                <Input id="zip" placeholder="10001" />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        
                        {(selectedPaymentMethod === 'gcash' || selectedPaymentMethod === 'bank') && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{selectedPaymentMethod === 'gcash' ? 'GCash Payment' : 'Bank Transfer'}</CardTitle>
                                    <CardDescription>
                                        {selectedPaymentMethod === 'gcash'
                                            ? "Scan the QR code or send payment to the number below."
                                            : "Please transfer the total amount to the bank account below."
                                        }
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                {selectedPaymentMethod === 'gcash' && (
                                    <Alert>
                                        <AlertTitle>GCash Details</AlertTitle>
                                        <AlertDescription className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                                            <Image src="https://s.yimg.com/zb/imgv1/fdf01399-282a-35f4-9488-09b69236ff0f/t_500x300" alt="GCash QR Code" width={128} height={128} className="rounded-md" />
                                            <div className="text-center sm:text-left">
                                                <p><strong>Name:</strong> Sportscar Hub</p>
                                                <p><strong>Number:</strong> 0917 123 4567</p>
                                                <p className="font-bold text-lg mt-1">Amount: PHP {(cartTotal * 55).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                                                <p className="text-xs text-muted-foreground">(Assuming 1 USD = 55 PHP)</p>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                {selectedPaymentMethod === 'bank' && (
                                     <Alert>
                                        <AlertTitle>Bank Account Details</AlertTitle>
                                        <AlertDescription className="mt-2">
                                            <div className="space-y-1 text-sm">
                                                <p><strong>Bank Name:</strong> BDO (Banco de Oro)</p>
                                                <p><strong>Account Name:</strong> Sportscar Hub Inc.</p>
                                                <p><strong>Account Number:</strong> 0012 3456 7890</p>
                                                <p className="font-bold text-base mt-2">Amount: USD ${cartTotal.toLocaleString()}</p>
                                            </div>
                                        </AlertDescription>
                                    </Alert>
                                )}

                                    <div className="space-y-2">
                                        <Label htmlFor="payment-proof" className="text-base font-semibold">Upload Proof of Payment</Label>
                                        <Input id="payment-proof" type="file" accept="image/*" onChange={handleProofUpload} className="h-auto p-2" />
                                        <p className="text-sm text-muted-foreground">Please upload a screenshot of your transaction receipt.</p>
                                    </div>

                                    {paymentProofPreview && (
                                        <div>
                                            <h4 className="font-medium mb-2">Proof Preview:</h4>
                                            <div className="relative border rounded-md p-2">
                                                <Image src={paymentProofPreview} alt="Payment proof preview" width={200} height={400} className="rounded-md object-contain max-h-64 w-auto mx-auto" />
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                    <div className="md:col-span-1 space-y-8 sticky top-24">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                            {cartItems?.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
                                <Image src={item.imageUrl} alt={item.make} width={80} height={60} className="rounded-md object-cover" />
                                <div className="flex-1">
                                    <p className="font-medium">{item.make} {item.model}</p>
                                    <p className="text-sm text-muted-foreground">${item.price.toLocaleString()}</p>
                                </div>
                                </div>
                            ))}
                                <div className="border-t pt-4 mt-4 space-y-2">
                                <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>${cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span>${cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Button onClick={handlePlaceOrder} className="w-full" size="lg" disabled={isPlaceOrderDisabled}>
                            {isProcessing ? 'Processing...' : 'Place Order'}
                        </Button>
                    </div>
                </div>
            </ClientOnly>
        
    )
}

export default function CheckoutPage() {
    return (
        <div className="container py-12">
            <Suspense fallback={<div>Loading checkout...</div>}>
                <CheckoutForm />
            </Suspense>
        </div>
    );
}
