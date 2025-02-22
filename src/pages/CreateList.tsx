import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiService } from "@/services/apiService";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { SideDrawer } from "@/components/SideDrawer";

interface CSVRow {
  [key: string]: string;
}

interface NumberDetails {
  list_name: string;
  owner: string;
  number: string;
  name: string;
  interests: string;
  age: string;
  location: string;
  gender: string;
  language: string;
  occupation: string;
  preferred_contact_time: string;
  tags: string;
  additional_details: string;
}

export default function CreateList() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [selectedHeaders, setSelectedHeaders] = useState<{[key: string]: string}>({});
  const [listName, setListName] = useState("");
  const [numberColumnIndex, setNumberColumnIndex] = useState<string>("");
  const [customFields, setCustomFields] = useState<{[key: string]: string}[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [contactName, setContactName] = useState("");
  const [interests, setInterests] = useState("");
  const [age, setAge] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [occupation, setOccupation] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [tags, setTags] = useState("");
  const [additionalDetails, setAdditionalDetails] = useState("");

  const handleAuth = async () => {
    if (!username || !password) {
      toast({
        title: "Error",
        description: "Please enter both username and password",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await apiService.registerUser(username, password, "marketer");
      console.log("Register response:", response);
      
      if (response.message === "User created successfully") {
        setIsAuthenticated(true);
        toast({
          title: "Success",
          description: "User registered successfully",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to register user",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Authentication Error",
        description: error.message || "Failed to register user",
        variant: "destructive",
      });

      setPassword("");
    }
  };

  const extractPhoneNumber = (phoneString: string): string => {
    try {
      const cleanString = phoneString.replace(/[\[\]']/g, '');
      const numbers = cleanString.split(',').map(num => num.trim());
      return numbers[0] || '';
    } catch (error) {
      console.error("Error parsing phone number:", error);
      return '';
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      Papa.parse(file, {
        skipEmptyLines: true,
        header: false,
        complete: (results) => {
          console.log("CSV Parse Results:", results);
          if (results.data && Array.isArray(results.data) && results.data.length > 0) {
            const headers = results.data[0] as string[];
            const rows = results.data.slice(1).map(row => {
              const obj: { [key: string]: string } = {};
              (row as string[]).forEach((cell, index) => {
                obj[headers[index]] = cell;
              });
              return obj;
            });
            
            console.log("Headers:", headers);
            console.log("First 5 rows:", rows.slice(0, 5));
            
            setHeaders(headers);
            setCsvData(rows.slice(0, 5) as CSVRow[]);

            const phoneColumnIndex = headers.findIndex(h => 
              h.toLowerCase().includes('phone') || 
              h.toLowerCase().includes('number') || 
              h.toLowerCase().includes('mobile')
            );
            if (phoneColumnIndex !== -1) {
              setNumberColumnIndex(headers[phoneColumnIndex]);
            }
          }
        },
        error: (error) => {
          console.error("CSV Parse Error:", error);
          toast({
            title: "Error",
            description: "Failed to parse CSV file. Please check the file format.",
            variant: "destructive",
          });
        }
      });
    }
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    maxFiles: 1,
  });

  const addCustomField = () => {
    setCustomFields([...customFields, { key: "", value: "" }]);
  };

  const updateCustomField = (index: number, field: string, value: string) => {
    const newFields = [...customFields];
    newFields[index] = { ...newFields[index], [field]: value };
    setCustomFields(newFields);
  };

  const handleAddNumber = async () => {
    try {
      const numberData: NumberDetails = {
        list_name: listName,
        owner: username,
        number: number,
        name: contactName,
        interests,
        age,
        location,
        gender,
        language,
        occupation,
        preferred_contact_time: preferredTime,
        tags,
        additional_details: additionalDetails
      };

      await apiService.addNumberToList(numberData);
      toast({
        title: "Success",
        description: "Number added successfully",
      });
      // Reset form
      setNumber("");
      setContactName("");
      setInterests("");
      setAge("");
      setLocation("");
      setGender("");
      setLanguage("");
      setOccupation("");
      setPreferredTime("");
      setTags("");
      setAdditionalDetails("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add number",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Error",
        description: "Please authenticate first",
        variant: "destructive",
      });
      return;
    }

    if (!listName || !numberColumnIndex) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      await apiService.createNumberList(listName, username);

      for (const row of csvData) {
        const rawPhoneNumber = row[numberColumnIndex];
        const cleanedPhoneNumber = extractPhoneNumber(rawPhoneNumber);

        if (!cleanedPhoneNumber) {
          console.warn("Skipping invalid phone number:", rawPhoneNumber);
          continue;
        }

        const numberData = {
          list_name: listName,
          username: username,
          number: cleanedPhoneNumber,
          name: row[selectedHeaders.name] || "",
          interests: row[selectedHeaders.interests] || "",
          age: row[selectedHeaders.age] || "",
          location: row[selectedHeaders.location] || "",
          gender: row[selectedHeaders.gender] || "",
          language: row[selectedHeaders.language] || "",
          occupation: row[selectedHeaders.occupation] || "",
          preferred_contact_time: row[selectedHeaders.preferred_contact_time] || "",
          tags: row[selectedHeaders.tags] || "",
          additional_details: JSON.stringify(
            customFields.reduce((acc, field) => {
              acc[field.key] = row[field.value] || "";
              return acc;
            }, {} as {[key: string]: string})
          ),
        };

        await apiService.addNumberToList(numberData);
      }

      toast({
        title: "Success",
        description: "List created successfully",
      });

      navigate("/create-campaign", { 
        state: { 
          listName,
          username
        }
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <SideDrawer />
      <div className="container mx-auto py-6 px-4">
        <h1 className="text-3xl font-bold mb-6">Create Number List</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>
              <Button 
                onClick={handleAuth}
                disabled={isProcessing}
              >
                {isAuthenticated ? "Authenticated" : "Authenticate"}
              </Button>
            </CardContent>
          </Card>

          {isAuthenticated && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Upload CSV</CardTitle>
                </CardHeader>
                <CardContent>
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                      ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300'}`}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <p>Drop the CSV file here...</p>
                    ) : (
                      <p>Drag and drop a CSV file here, or click to select</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {csvData.length > 0 && headers.length > 0 && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle>Configure List</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="listName">List Name</Label>
                        <Input 
                          id="listName"
                          value={listName} 
                          onChange={(e) => setListName(e.target.value)}
                          placeholder="Enter list name"
                        />
                      </div>

                      <div>
                        <Label>Number Column</Label>
                        <select 
                          className="w-full p-2 border rounded-md"
                          value={numberColumnIndex}
                          onChange={(e) => setNumberColumnIndex(e.target.value)}
                        >
                          <option value="">Select number column</option>
                          {headers.map((header) => (
                            <option key={header} value={header}>
                              {header}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <Label>Map Fields</Label>
                        {["name", "interests", "age", "location", "gender", "language", 
                          "occupation", "preferred_contact_time", "tags"].map((field) => (
                          <div key={field} className="flex gap-2 items-center mt-2">
                            <Label className="w-40">{field}</Label>
                            <select 
                              className="w-full p-2 border rounded-md"
                              value={selectedHeaders[field] || ""}
                              onChange={(e) => setSelectedHeaders({
                                ...selectedHeaders,
                                [field]: e.target.value
                              })}
                            >
                              <option value="">None</option>
                              {headers.map((header) => (
                                <option key={header} value={header}>
                                  {header}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>

                      <div>
                        <Label>Custom Fields</Label>
                        {customFields.map((field, index) => (
                          <div key={index} className="flex gap-2 mt-2">
                            <Input
                              placeholder="Field name"
                              value={field.key}
                              onChange={(e) => updateCustomField(index, 'key', e.target.value)}
                            />
                            <select 
                              className="w-full p-2 border rounded-md"
                              value={field.value}
                              onChange={(e) => updateCustomField(index, 'value', e.target.value)}
                            >
                              <option value="">Select column</option>
                              {headers.map((header) => (
                                <option key={header} value={header}>
                                  {header}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                        <Button 
                          variant="outline" 
                          onClick={addCustomField}
                          className="mt-2"
                        >
                          Add Custom Field
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Preview (First 5 Rows)</CardTitle>
                    </CardHeader>
                    <CardContent>
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
                            {csvData.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {headers.map((header) => (
                                  <TableCell key={header}>
                                    {row[header]}
                                  </TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button 
                      onClick={handleSubmit}
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Create List & Continue"}
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
