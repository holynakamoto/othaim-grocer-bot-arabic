
import React, { useState, useRef, useEffect } from 'react';
import { Send, ShoppingCart, Package, Coffee, Apple, Beef, IceCream } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  products?: Product[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  category: string;
  image: string;
  inStock: boolean;
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'مرحباً بكم في أسواق العثيم! كيف يمكنني مساعدتكم في العثور على البقالة التي تحتاجونها اليوم؟',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const sampleProducts: Product[] = [
    { id: 1, name: 'حليب نادك كامل الدسم 1 لتر', price: '4.50 ريال', category: 'ألبان', image: '/placeholder.svg', inStock: true },
    { id: 2, name: 'خبز تميس أبيض', price: '2.00 ريال', category: 'مخبوزات', image: '/placeholder.svg', inStock: true },
    { id: 3, name: 'أرز بسمتي سيلا 5 كيلو', price: '24.95 ريال', category: 'حبوب', image: '/placeholder.svg', inStock: true },
    { id: 4, name: 'زيت زيتون إكسترا فيرجن', price: '45.00 ريال', category: 'زيوت', image: '/placeholder.svg', inStock: false },
    { id: 5, name: 'دجاج مجمد طازج 1 كيلو', price: '18.50 ريال', category: 'لحوم ودواجن', image: '/placeholder.svg', inStock: true },
    { id: 6, name: 'تفاح أحمر مستورد 1 كيلو', price: '8.75 ريال', category: 'فواكه وخضار', image: '/placeholder.svg', inStock: true },
  ];

  const categories = [
    { name: 'فواكه وخضار', icon: Apple, color: 'bg-green-100 text-green-600' },
    { name: 'لحوم ودواجن', icon: Beef, color: 'bg-red-100 text-red-600' },
    { name: 'ألبان ومجمدات', icon: IceCream, color: 'bg-blue-100 text-blue-600' },
    { name: 'مشروبات', icon: Coffee, color: 'bg-amber-100 text-amber-600' },
    { name: 'مخبوزات', icon: Package, color: 'bg-orange-100 text-orange-600' },
    { name: 'منظفات', icon: Package, color: 'bg-purple-100 text-purple-600' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = () => {
    setIsTyping(true);
    return new Promise(resolve => setTimeout(resolve, 1500));
  };

  const getAIResponse = async (userMessage: string): Promise<Message> => {
    await simulateTyping();
    setIsTyping(false);

    const lowerMessage = userMessage.toLowerCase();
    
    // Simple product search simulation
    if (lowerMessage.includes('حليب') || lowerMessage.includes('ألبان')) {
      const relevantProducts = sampleProducts.filter(p => p.category === 'ألبان');
      return {
        id: Date.now(),
        text: 'وجدت لكم هذه المنتجات من الألبان المتوفرة في أسواق العثيم:',
        isUser: false,
        timestamp: new Date(),
        products: relevantProducts
      };
    }
    
    if (lowerMessage.includes('فواكه') || lowerMessage.includes('خضار') || lowerMessage.includes('تفاح')) {
      const relevantProducts = sampleProducts.filter(p => p.category === 'فواكه وخضار');
      return {
        id: Date.now(),
        text: 'إليكم أفضل الفواكه والخضار الطازجة المتوفرة:',
        isUser: false,
        timestamp: new Date(),
        products: relevantProducts
      };
    }

    if (lowerMessage.includes('لحم') || lowerMessage.includes('دجاج') || lowerMessage.includes('لحوم')) {
      const relevantProducts = sampleProducts.filter(p => p.category === 'لحوم ودواجن');
      return {
        id: Date.now(),
        text: 'هذه أفضل اللحوم والدواجن الطازجة لدينا:',
        isUser: false,
        timestamp: new Date(),
        products: relevantProducts
      };
    }

    if (lowerMessage.includes('أرز') || lowerMessage.includes('حبوب')) {
      const relevantProducts = sampleProducts.filter(p => p.category === 'حبوب');
      return {
        id: Date.now(),
        text: 'إليكم أفضل أنواع الأرز والحبوب المتوفرة:',
        isUser: false,
        timestamp: new Date(),
        products: relevantProducts
      };
    }

    // Default responses
    const responses = [
      'شكراً لتواصلكم معنا! يمكنني مساعدتكم في البحث عن أي منتج. جربوا البحث عن "حليب" أو "فواكه" أو "لحوم".',
      'أسواق العثيم تضم أكثر من 10,000 منتج متنوع. ما نوع البقالة التي تبحثون عنها؟',
      'يمكنكم تصفح الأقسام المختلفة أو البحث عن منتج محدد. كيف يمكنني مساعدتكم؟'
    ];
    
    return {
      id: Date.now(),
      text: responses[Math.floor(Math.random() * responses.length)],
      isUser: false,
      timestamp: new Date(),
    };
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    const aiResponse = await getAIResponse(inputValue);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleCategoryClick = async (categoryName: string) => {
    const categoryMessage: Message = {
      id: Date.now(),
      text: `أريد تصفح قسم ${categoryName}`,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, categoryMessage]);
    const aiResponse = await getAIResponse(categoryName);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-green-600">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">مساعد أسواق العثيم</h1>
                <p className="text-gray-600">خدمة البحث عن البقالة بالذكاء الاصطناعي</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-600 font-semibold">متصل الآن</div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">تصفح الأقسام</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={index} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
                  onClick={() => handleCategoryClick(category.name)}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`w-12 h-12 ${category.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-gray-700">{category.name}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Chat Container */}
        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-start' : 'justify-end'} animate-in slide-in-from-bottom-2 duration-300`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isUser
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-md rounded-bl-sm border border-gray-200'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.isUser ? 'text-green-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString('ar-SA', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                  
                  {/* Product Cards */}
                  {message.products && message.products.length > 0 && (
                    <div className="grid grid-cols-1 gap-3 mt-4">
                      {message.products.map((product) => (
                        <Card key={product.id} className="bg-gray-50 border border-gray-200">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg bg-gray-200"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 text-sm truncate">
                                  {product.name}
                                </h4>
                                <p className="text-green-600 font-bold text-sm">{product.price}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-xs text-gray-500">{product.category}</span>
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    product.inStock 
                                      ? 'bg-green-100 text-green-600' 
                                      : 'bg-red-100 text-red-600'
                                  }`}>
                                    {product.inStock ? 'متوفر' : 'غير متوفر'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-end animate-in slide-in-from-bottom-2 duration-300">
                <div className="bg-white text-gray-800 shadow-md rounded-2xl rounded-bl-sm border border-gray-200 px-4 py-3 max-w-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتبوا هنا للبحث عن المنتجات..."
                className="flex-1 text-right border-gray-300 focus:border-green-500 focus:ring-green-500"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              جربوا البحث عن: "حليب"، "فواكه"، "لحوم"، أو اختاروا من الأقسام أعلاه
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600">
          <p className="text-sm">© 2024 أسواق العثيم - خدمة العملاء الذكية</p>
          <p className="text-xs mt-1">مدعوم بتقنية الذكاء الاصطناعي لتجربة تسوق أفضل</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
