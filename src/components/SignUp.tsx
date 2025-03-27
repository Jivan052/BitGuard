import { useState, useEffect } from 'react';

// Extend the Window interface to include the ethereum property
declare global {
  interface Window {
    ethereum?: any;
  }
}
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Bitcoin, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { ethers } from 'ethers';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [metaMaskInstalled, setMetaMaskInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    wallet: '',
    terms: ''
  });

  // Check if MetaMask is installed
  useEffect(() => {
    if (window.ethereum) {
      setMetaMaskInstalled(true);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        const address = accounts[0];
        setWalletAddress(address);
        
        // Clear wallet error if any
        if (errors.wallet) {
          setErrors({
            ...errors,
            wallet: ''
          });
        }
        
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } else {
        setErrors({
          ...errors,
          wallet: 'MetaMask is not installed. Please install MetaMask to continue.'
        });
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setErrors({
        ...errors,
        wallet: 'Failed to connect wallet. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      wallet: '',
      terms: ''
    };
    
    let isValid = true;
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }
    
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Wallet validation
    if (!walletAddress) {
      newErrors.wallet = 'Please connect your MetaMask wallet';
      isValid = false;
    }
    
    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate account creation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would normally make an API call to create the account
      // const response = await api.createAccount({...formData, walletAddress});
      
      toast({
        title: "Account created successfully!",
        description: "Welcome to BitGuardian. You are now being redirected.",
      });
      
      // Redirect to home page after successful sign up
      setTimeout(() => {
        navigate('/');
      }, 1000);
      
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: "Error creating account",
        description: "An error occurred while creating your account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 mt-16">
        <div className="max-w-md mx-auto">
          <Card className="shadow-lg border-muted glass-card">
            <CardHeader className="space-y-1 text-center">
              <div className="flex justify-center mb-2">
                <Bitcoin size={40} className="text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>
                Join BitGuardian to secure your bitcoin assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email" 
                        name="email"
                        placeholder="name@example.com" 
                        type="email"
                        className="pl-10"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="password" 
                        name="password"
                        type="password"
                        className="pl-10"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                    {errors.password && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input 
                      id="confirmPassword" 
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Connect Wallet</Label>
                    <Button 
                      type="button"
                      variant={walletAddress ? "outline" : "secondary"}
                      className="w-full"
                      onClick={connectWallet}
                      disabled={isLoading || !metaMaskInstalled}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                          Connecting...
                        </>
                      ) : walletAddress ? (
                        <>
                          <span className="text-primary mr-2">✓</span>
                          {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
                        </>
                      ) : (
                        "Connect MetaMask"
                      )}
                    </Button>
                    {!metaMaskInstalled && (
                      <p className="text-sm text-amber-500 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        MetaMask not detected. Please install MetaMask extension.
                      </p>
                    )}
                    {errors.wallet && (
                      <p className="text-sm text-destructive flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        {errors.wallet}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="terms" 
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => 
                        setFormData({...formData, agreeTerms: checked as boolean})
                      }
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I agree to the{" "}
                      <a href="/sign-up" className="text-primary hover:underline">
                        terms of service
                      </a>{" "}
                      and{" "}
                      <a href="/sign-up" className="text-primary hover:underline">
                        privacy policy
                      </a>
                    </label>
                  </div>
                  {errors.terms && (
                    <p className="text-sm text-destructive flex items-center">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {errors.terms}
                    </p>
                  )}
                </div>
                
                <Button 
                  className="w-full mt-6" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Already have an account?{" "}
                <a href="/dashboard" className="text-primary hover:underline">
                  Log in
                </a>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SignUp;