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
} from '@chakra-ui/react';
import { SettingsIcon } from '@chakra-ui/icons';
import { InventoryParams } from '../types';

interface InventoryParametersProps {
  params: InventoryParams;
  showParams: boolean;
  onParamChange: (param: keyof InventoryParams) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleParams: () => void;
}

export function InventoryParameters({ 
  params, 
  showParams, 
  onParamChange, 
  onToggleParams 
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
        <Stack spacing={4} bg="gray.50" p={4} borderRadius="md">
          <FormControl>
            <FormLabel>Safety Stock (Days)</FormLabel>
            <Input
              type="number"
              value={params.safetyStockDays}
              onChange={onParamChange("safetyStockDays")}
            />
            <FormHelperText>
              Minimum days of stock you want to maintain
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Production Lead Time (Days)</FormLabel>
            <Input
              type="number"
              value={params.productionLeadTime}
              onChange={onParamChange("productionLeadTime")}
            />
            <FormHelperText>
              Days needed for production before shipping
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Shipping Lead Time (Days)</FormLabel>
            <Input
              type="number"
              value={params.shippingLeadTime}
              onChange={onParamChange("shippingLeadTime")}
            />
            <FormHelperText>Days needed for shipping to Amazon FBA</FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Maximum Stock (Days)</FormLabel>
            <Input
              type="number"
              value={params.maxStockDays}
              onChange={onParamChange("maxStockDays")}
            />
            <FormHelperText>
              Maximum days of stock you want to maintain
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Current FBA Stock</FormLabel>
            <Input
              type="number"
              value={params.currentFBAStock}
              onChange={onParamChange("currentFBAStock")}
            />
            <FormHelperText>Current stock in Amazon FBA</FormHelperText>
          </FormControl>
        </Stack>
      </Collapse>
    </Box>
  );
}
