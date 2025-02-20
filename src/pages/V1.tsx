
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

interface CSVRow {
  [key: string]: string;
}

const BASE_URL = "https://magic.applytocollege.pk";
const USERNAME = "Farhana";

export default function V1() {
  const { toast } = useToast();
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

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          if (results.data && Array.isArray(results.data) && results.data.length > 0) {
            const headers = results.data[0] as string[];
            const rows = results.data.slice(1).map(row => {
              const obj: { [key: string]: string } = {};
              (row as string[]).forEach((cell, index) => {
                obj[headers[index]] = cell;
              });
              return obj;
            });
            
            setHeaders(headers);
            setCsvData(rows as CSVRow[]);
          }
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const handleCreateCampaign = async () => {
    if (!campaignName || !adPost || !nameColumn || !numberColumn) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // First create the campaign
      const formData = new FormData();
      formData.append('name', campaignName);
      formData.append('message', adPost);
      formData.append('start_time', startTime);
      formData.append('end_time', endTime);
      formData.append('timezone', timezone);
      formData.append('created_by', USERNAME);

      const campaignResponse = await fetch(`${BASE_URL}/campaign/create`, {
        method: 'POST',
        body: formData,
      });

      const campaignData = await campaignResponse.json();
      
      if (campaignData.status !== "success") {
        throw new Error("Failed to create campaign");
      }

      // Then add numbers to the campaign
      const numbers = csvData.map(row => ({
        name: row[nameColumn],
        phone: row[numberColumn],
      }));

      const numbersResponse = await fetch(`${BASE_URL}/campaign/add_numbers/${campaignData.campaign_id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ numbers }),
      });

      const numbersData = await numbersResponse.json();
      
      if (numbersData.status !== "success") {
        throw new Error("Failed to add numbers to campaign");
      }

      toast({
        title: "Success",
        description: `Campaign created with ${numbersData.total_numbers} numbers`,
      });

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
              <Label>Upload CSV</Label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary"
              >
                <input {...getInputProps()} />
                <p>Drag & drop a CSV file here, or click to select one</p>
              </div>
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
                      onChange={(e) => setNumberColumn(e.target.value)}
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
                    {csvData.length > 5 && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Showing first 5 rows of {csvData.length} total rows
                      </p>
                    )}
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
    </div>
  );
}
