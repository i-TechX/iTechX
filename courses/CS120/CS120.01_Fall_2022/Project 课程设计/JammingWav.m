%% Gennerate jamming wav
clear all;
wavelen = 48000*5*60; % 5 mins
wav = 2*(rand(1,wavelen)-0.5)*32767; % random noise
wav = int16(wav);
mask = zeros(1,length(wav)+200*48); % mask to generate quiet period
i=1;
flag = 0;
while(i<length(wav))
    
    if flag == 0
        duration = int32((100+rand(1)*100)*48); % 0.1s to 0.2s quiet
%         mask(i:i+duration-1) = 0;
        i = i+duration;
        flag = 1;
    else
        duration = int32((50+rand(1)*50)*48); % 0.05s to 0.1s noisy
        mask(i:i+duration-1) = 1;
        i = i+duration;
        flag = 0;
    end
end

mask = int16(mask(1:length(wav)));


jammingwav = mask.*wav;
plot(0:1/48000:5*60-1/48000,jammingwav);
% sound(double(jammingwav)/32767, 48000)

audiowrite('Jamming.wav',jammingwav,48000);