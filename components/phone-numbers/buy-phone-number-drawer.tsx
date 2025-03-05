import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Icons } from '@/components/icons';

interface BuyPhoneNumberDrawerProps {
  open: boolean;
  onClose: () => void;
}

const BuyPhoneNumberDrawer: React.FC<BuyPhoneNumberDrawerProps> = ({ open, onClose }) => {
  const [countries, setCountries] = useState<{ code: string; name: string; emoji: string }[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<string[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [phoneNumberPrice, setPhoneNumberPrice] = useState<number>(0);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch('/api/twilio');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Error loading countries:', error);
      }
    };
    loadCountries();
  }, []);

  const handleFetchPhoneNumbers = async () => {
    if (!selectedCountry) return;
    setIsFetching(true);
    try {
      const response = await fetch(`/api/twilio/numbers?country=${selectedCountry}`);
      const data = await response.json();
      setAvailableNumbers(data.numbers);

      const pricingResponse = await fetch(`/api/twilio/pricing?country=${selectedCountry}`);
      const pricingData = await pricingResponse.json();
      const localPrice = pricingData.phone_number_prices.find(price => price.number_type === 'local');
      setPhoneNumberPrice(parseFloat(localPrice?.current_price || '0'));
    } catch (error) {
      console.error('Error fetching phone numbers or pricing:', error);
    }
    setIsFetching(false);
  };

  const handleSelectPhoneNumber = (number: string) => {
    setSelectedNumber(number);
  };

  const handleBuyNumber = () => {
    if (!selectedNumber) return;
    console.log(`Buying number: ${selectedNumber}`);
  };

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Buy a New Phone Number</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Select your country to start searching.
          </p>
          <div className="mt-4">
            <Select onValueChange={setSelectedCountry}>
              <SelectTrigger>
                <SelectValue placeholder="Select Country" />
              </SelectTrigger>
              <SelectContent>
                {countries.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span>{country.emoji}</span>
                      {country.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="primary"
              className="mt-2"
              onClick={handleFetchPhoneNumbers}
              disabled={!selectedCountry || isFetching}
            >
              <Icons.search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          {availableNumbers.length > 0 && (
            <div className="mt-4">
              <Select onValueChange={handleSelectPhoneNumber}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Phone Number" />
                </SelectTrigger>
                <SelectContent>
                  {availableNumbers.map((number) => (
                    <SelectItem key={number} value={number}>
                      {number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </DrawerBody>
        <DrawerFooter className="flex flex-col items-start space-y-2 mt-4">
          <Button
            variant="primary"
            onClick={handleBuyNumber}
            disabled={!selectedNumber}
          >
            {selectedNumber
              ? `Buy Phone Number for $${(phoneNumberPrice + 3.0).toFixed(2)}/month`
              : 'Buy Phone Number'}
          </Button>
          <div className="h-0.5" />
          {selectedNumber && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Your subscription will automatically renew on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default BuyPhoneNumberDrawer; 