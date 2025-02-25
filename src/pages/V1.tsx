import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Papa from "papaparse";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

interface CSVRow {
  [key: string]: string;
}

const BASE_URL = "https://whatsappmarket.applytocollege.pk";
const USERNAME = "Farhana";

export default function V1() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [campaignName, setCampaignName] = useState("");
  const [adPost, setAdPost] = useState("");
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [nameColumn, setNameColumn] = useState("");
  const [numberColumn, setNumberColumn] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [timezone, setTimezone] = useState("Asia/Karachi");
  const [isLoading, setIsLoading] = useState(false);
  const [numberRegex, setNumberRegex] = useState("\\d+");
  const [showMultipleNumbersDialog, setShowMultipleNumbersDialog] = useState(false);
  const [multipleNumbersHandling, setMultipleNumbersHandling] = useState<"first" | "skip" | undefined>(undefined);
  const [tempProcessedData, setTempProcessedData] = useState<{ name: string; phone: string }[]>([]);
  const [rowSelection, setRowSelection] = useState<"top" | "skip">("top");
  const [rowCount, setRowCount] = useState<number>(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [numberPrefix, setNumberPrefix] = useState("");
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [sampleNumber, setSampleNumber] = useState("");

  const handleNumberColumnSelect = (columnName: string) => {
    setNumberColumn(columnName);
    if (csvData.length > 0) {
      const firstRow = csvData[0];
      const sampleNum = firstRow[columnName];
      setSampleNumber(String(sampleNum || ''));
      setShowPreviewDialog(true);
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data) && results.data.length > 0) {
            const firstRow = results.data[0] as CSVRow;
            const headers = Object.keys(firstRow);
            
            setHeaders(headers);
            setCsvData(results.data as CSVRow[]);

            if (numberColumn && headers.includes(numberColumn)) {
              setSampleNumber(String(firstRow[numberColumn] || ''));
              setShowPreviewDialog(true);
            }
          }
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  }, [numberColumn]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const processPhoneNumbers = (row: CSVRow) => {
    const cellValue = row[numberColumn];
    if (!cellValue) return null;

    try {
      // First, clean the number of any formatting
      let cleanNumber = cellValue.replace(/[\s\-\(\)\+]/g, '');
      
      // Log the cleaning process
      console.log('Processing number:', {
        original: cellValue,
        cleaned: cleanNumber
      });

      // If the number is empty after cleaning, return null
      if (!cleanNumber) return null;

      // Return the cleaned number with optional prefix
      const finalNumber = numberPrefix ? `${numberPrefix}${cleanNumber}` : cleanNumber;
      console.log('Final processed number:', finalNumber);
      return finalNumber;

    } catch (error) {
      console.error("Number processing error:", error);
      return null;
    }
  };

  const prepareNumbers = () => {
    let dataToProcess = [...csvData];
    
    if (rowCount > 0) {
      if (rowSelection === "top") {
        dataToProcess = dataToProcess.slice(0, rowCount);
      } else {
        dataToProcess = dataToProcess.slice(rowCount);
      }
    }

    console.log('Processing data:', dataToProcess); // Log data being processed

    const processedNumbers = dataToProcess.map(row => {
      const phoneNumber = processPhoneNumbers(row);
      console.log('Processed row:', { row, resultNumber: phoneNumber }); // Log each processing result
      
      if (!phoneNumber) return null;

      return {
        name: row[nameColumn] || "Unknown",
        phone: phoneNumber,
      };
    }).filter((item): item is { name: string; phone: string } => item !== null);

    console.log('All processed numbers:', processedNumbers); // Log all processed numbers

    // Add default test numbers even if no other numbers were processed
    const defaultTestNumbers = [
      { name: "Test Number 1", phone: "923080601646" },
      { name: "Test Number 2", phone: "923461115757" }
    ];

    // Always include test numbers
    const finalNumbers = [...processedNumbers, ...defaultTestNumbers];
    console.log('Final numbers list:', finalNumbers);

    // Only show error if no user numbers were processed (excluding test numbers)
    if (processedNumbers.length === 0) {
      toast({
        title: "Notice",
        description: "No valid phone numbers found in CSV. Only test numbers will be included.",
        variant: "default"
      });
    }

    return finalNumbers;
  };

  const formatNumber = (number: string, prefix: string = "") => {
    // Clean the number of any formatting characters
    const cleanNumber = number.replace(/[\s\-\(\)\+]/g, '');
    console.log('Format number:', { original: number, cleaned: cleanNumber, prefix });
    return prefix ? `${prefix}${cleanNumber}` : cleanNumber;
  };

  const handleMultipleNumbersDecision = (useFirstNumber: boolean) => {
    setShowMultipleNumbersDialog(false);
    setMultipleNumbersHandling(useFirstNumber ? "first" : "skip");
    toast({
      title: "Selection saved",
      description: useFirstNumber 
        ? "Will use the first number from cells with multiple numbers" 
        : "Will skip rows with multiple numbers",
    });
  };

  const handleCreateCampaign = async () => {
    if (!campaignName || !adPost || !nameColumn || !numberColumn) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!mediaFile) {
      toast({
        title: "Error",
        description: "Image file is required",
        variant: "destructive",
      });
      return;
    }

    const numbers = prepareNumbers();
    if (!numbers) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', campaignName);
      formData.append('message', adPost);
      formData.append('start_time', startTime);
      formData.append('end_time', endTime);
      formData.append('timezone', timezone);
      formData.append('created_by', USERNAME);
      formData.append('image', mediaFile);

      const campaignResponse = await fetch(`${BASE_URL}/campaign/create`, {
        method: 'POST',
        body: formData,
      });

      if (!campaignResponse.ok) {
        throw new Error(`Failed to create campaign: ${campaignResponse.statusText}`);
      }

      const campaignData = await campaignResponse.json();
      console.log("Campaign creation response:", campaignData);
      
      if (campaignData.status !== "success") {
        throw new Error(campaignData.error || "Failed to create campaign");
      }

      const formattedNumbers = numbers.map(num => ({
        name: num.name,
        phone: formatNumber(num.phone, numberPrefix)
      }));

      console.log("Sending numbers to API:", formattedNumbers);

      const numbersResponse = await fetch(`${BASE_URL}/campaign/add_numbers/${campaignData.campaign_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numbers: formattedNumbers }),
      });

      if (!numbersResponse.ok) {
        throw new Error(`Failed to add numbers: ${numbersResponse.statusText}`);
      }

      const numbersData = await numbersResponse.json();
      console.log("Numbers addition response:", numbersData);
      
      if (numbersData.status !== "success") {
        throw new Error(numbersData.error || "Failed to add numbers to campaign");
      }

      toast({
        title: "Success",
        description: `Campaign created with ${formattedNumbers.length} numbers (including 2 test numbers)`,
      });

      navigate("/campaigns");

    } catch (error: any) {
      console.error("Campaign creation error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create New Campaign (V1)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="campaignName">Campaign Name</Label>
              <Input
                id="campaignName"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adPost">Ad Post Content</Label>
              <Textarea
                id="adPost"
                value={adPost}
                onChange={(e) => setAdPost(e.target.value)}
                placeholder="Enter your ad post content"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberRegex">Phone Number Regex Pattern</Label>
              <Input
                id="numberRegex"
                value={numberRegex}
                onChange={(e) => setNumberRegex(e.target.value)}
                placeholder="Enter regex pattern for phone numbers"
              />
              <p className="text-sm text-muted-foreground">
                Use this to extract phone numbers from cells. Default pattern matches any sequence of digits.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberPrefix">Number Prefix (Optional)</Label>
              <Input
                id="numberPrefix"
                value={numberPrefix}
                onChange={(e) => setNumberPrefix(e.target.value)}
                placeholder="e.g., +1 for US numbers"
              />
              <p className="text-sm text-muted-foreground">
                Leave empty if numbers already include country code
              </p>
            </div>

            <div className="space-y-2">
              <Label>Upload CSV</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
              >
                <input {...getInputProps()} />
                <p>Drag & drop a CSV file here, or click to select one</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="media">Media File (Optional)</Label>
              <Input
                id="media"
                type="file"
                accept="image/*"
                onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
              />
            </div>

            {headers.length > 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameColumn">Name Column</Label>
                    <select
                      id="nameColumn"
                      className="w-full p-2 border rounded"
                      value={nameColumn}
                      onChange={(e) => setNameColumn(e.target.value)}
                    >
                      <option value="">Select column</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="numberColumn">Number Column</Label>
                    <select
                      id="numberColumn"
                      className="w-full p-2 border rounded"
                      value={numberColumn}
                      onChange={(e) => handleNumberColumnSelect(e.target.value)}
                    >
                      <option value="">Select column</option>
                      {headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rowSelection">Row Selection</Label>
                    <select
                      id="rowSelection"
                      className="w-full p-2 border rounded"
                      value={rowSelection}
                      onChange={(e) => setRowSelection(e.target.value as "top" | "skip")}
                    >
                      <option value="top">Use Top N Rows</option>
                      <option value="skip">Skip Top N Rows</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rowCount">Number of Rows</Label>
                    <Input
                      id="rowCount"
                      type="number"
                      min="0"
                      max={csvData.length}
                      value={rowCount}
                      onChange={(e) => setRowCount(Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="Enter number of rows (0 for all)"
                    />
                    <p className="text-sm text-muted-foreground">
                      {rowSelection === "top" 
                        ? "Will use the first N rows" 
                        : "Will skip the first N rows"}
                      {rowCount > 0 && ` (${rowSelection === "top" 
                        ? `Using rows 1-${Math.min(rowCount, csvData.length)}` 
                        : `Using rows ${rowCount + 1}-${csvData.length}`})`}
                    </p>
                  </div>
                </div>

                {csvData.length > 0 && (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {headers.map((header) => (
                            <TableHead key={header}>{header}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {csvData.slice(0, 5).map((row, index) => (
                          <TableRow key={index}>
                            {headers.map((header) => (
                              <TableCell key={header}>{row[header]}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing first 5 rows of {csvData.length} total rows
                      {rowCount > 0 && ` (${rowSelection === "top" 
                        ? `Will use first ${Math.min(rowCount, csvData.length)} rows` 
                        : `Will skip first ${rowCount} rows`})`}
                    </p>
                  </div>
                )}
              </div>
            )}

            <Button
              onClick={handleCreateCampaign}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? "Creating Campaign..." : "Create Campaign"}
            </Button>
          </CardContent>
        </Card>
      </main>

      <Dialog open={showMultipleNumbersDialog} onOpenChange={setShowMultipleNumbersDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Multiple Numbers Detected</DialogTitle>
            <DialogDescription>
              Some rows contain multiple phone numbers. How would you like to handle this?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button onClick={() => handleMultipleNumbersDecision(true)}>
              Use First Number Only
            </Button>
            <Button
              variant="outline"
              onClick={() => handleMultipleNumbersDecision(false)}
            >
              Skip Multiple Number Rows
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preview Number Format</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label>Sample Number Format</Label>
            <div className="mt-2 p-4 bg-muted rounded-lg">
              <p className="font-mono">Original: {sampleNumber || 'No number selected'}</p>
              <p className="font-mono">
                Formatted: {sampleNumber ? formatNumber(sampleNumber, numberPrefix) : 'No number selected'}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This is how your numbers will be formatted. If they already include the correct country code, leave the prefix empty.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>
              Confirm Format
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
