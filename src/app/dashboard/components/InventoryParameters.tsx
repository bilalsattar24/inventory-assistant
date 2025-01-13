import React from 'react';
import {
  Box,
  Stack,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  IconButton,
  Collapse,
  Skeleton,
  SimpleGrid,
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { InventoryParams } from '../types';

interface InventoryParametersProps {
  params: InventoryParams;
  showParams: boolean;
  onParamChange: (param: keyof InventoryParams) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleParams: () => void;
  isLoading?: boolean;
}

export function InventoryParameters({ 
  params, 
  showParams, 
  onParamChange, 
  onToggleParams,
  isLoading = false
}: InventoryParametersProps) {
  return (
    <Box mb={6}>
      <IconButton
        aria-label="Toggle parameters"
        icon={<SettingsIcon />}
        onClick={onToggleParams}
        size="sm"
        mb={2}
      />
      <Collapse in={showParams}>
        <Box bg="gray.50" p={4} borderRadius="md">
          <SimpleGrid columns={[1, 2, 3]} spacing={4}>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Safety Stock (Days)</FormLabel>
              <Skeleton isLoaded={!isLoading}>
                <Input
                  type="number"
                  value={params.safetyStockDays}
                  onChange={onParamChange("safetyStockDays")}
                  size="sm"
                />
              </Skeleton>
              <FormHelperText fontSize="xs">
                Minimum days of stock to maintain
              </FormHelperText>
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Production Lead Time (Days)</FormLabel>
              <Skeleton isLoaded={!isLoading}>
                <Input
                  type="number"
                  value={params.productionLeadTime}
                  onChange={onParamChange("productionLeadTime")}
                  size="sm"
                />
              </Skeleton>
              <FormHelperText fontSize="xs">
                Days needed for production
              </FormHelperText>
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Shipping Lead Time (Days)</FormLabel>
              <Skeleton isLoaded={!isLoading}>
                <Input
                  type="number"
                  value={params.shippingLeadTime}
                  onChange={onParamChange("shippingLeadTime")}
                  size="sm"
                />
              </Skeleton>
              <FormHelperText fontSize="xs">Days for FBA shipping</FormHelperText>
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Maximum Stock (Days)</FormLabel>
              <Skeleton isLoaded={!isLoading}>
                <Input
                  type="number"
                  value={params.maxStockDays}
                  onChange={onParamChange("maxStockDays")}
                  size="sm"
                />
              </Skeleton>
              <FormHelperText fontSize="xs">
                Maximum days of stock to maintain
              </FormHelperText>
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize="sm">Current FBA Stock</FormLabel>
              <Skeleton isLoaded={!isLoading}>
                <Input
                  type="number"
                  value={params.currentFBAStock}
                  onChange={onParamChange("currentFBAStock")}
                  size="sm"
                />
              </Skeleton>
              <FormHelperText fontSize="xs">Current FBA stock</FormHelperText>
            </FormControl>
          </SimpleGrid>
        </Box>
      </Collapse>
    </Box>
  );
}
