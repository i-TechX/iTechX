close all; clc;

% 设置起始点和该点向量
start_point = [0.4, 0.6, 1];
vector = [0.8, 1.2, 0.7];


[phi1, r1, z1] = cart2pol(start_point(1), start_point(2), start_point(3));
[phi2, theta2, R2] = cart2sph(start_point(1), start_point(2), start_point(3));
theta2 = pi/2 - theta2;


% 直角坐标系
figure(1); hold on; title('Cartesian');
quiver3(start_point(1), start_point(2),start_point(3), 1, 0, 0, 'g-', 'LineWidth', 2);
text(start_point(1) + 1, start_point(2),start_point(3), 'x','FontSize',18);
quiver3(start_point(1), start_point(2),start_point(3), 0, 1, 0, 'g-', 'LineWidth', 2);
text(start_point(1), start_point(2) + 1,start_point(3), 'y','FontSize',18);
quiver3(start_point(1), start_point(2),start_point(3), 0, 0, 1, 'g-', 'LineWidth', 2);
text(start_point(1), start_point(2),start_point(3)+1,'z','FontSize',18);

quiver3(start_point(1), start_point(2),start_point(3), vector(1), vector(2), vector(3), 'b-', 'LineWidth', 2);
text(start_point(1)+vector(1), start_point(2)+vector(2),start_point(3)+vector(3),'Vector','FontSize',18);

quiver3(0,0,0,0,0,3,1,'k','filled','LineWidth',2)
text(0,0,3.5,'z','FontSize',18)
quiver3(0,0,0,3,0,0,1,'k','filled','LineWidth',2)
text(3.5,0,0,'x','FontSize',18)
quiver3(0,0,0,0,3,0,1,'k','filled','LineWidth',2)
text(0,3.5,0,'y','FontSize',18)
view([1,1,1/2]);
axis equal;
hold off;

% 圆柱坐标系
figure(2); hold on; title('Cylindrical');
[x, y, z] = cylinder(ones(20, 1));
R = normest(start_point(:,1:2));
x=R*x;        
y=R*y;
z=3*z1*z - z1;
surf(x,y,z);
quiver3(start_point(1), start_point(2),start_point(3), cos(phi1), sin(phi1), 0, 'r-', 'LineWidth', 2);
text(start_point(1)+cos(phi1), start_point(2)+sin(phi1),start_point(3), 'r','FontSize',18);
quiver3(start_point(1), start_point(2),start_point(3), -sin(phi1), cos(phi1), 0, 'r-', 'LineWidth', 2);
text(start_point(1)-sin(phi1), start_point(2)+cos(phi1),start_point(3), '\phi','FontSize',18);
quiver3(start_point(1), start_point(2),start_point(3), 0, 0, 1, 'r-', 'LineWidth', 2);
text(start_point(1), start_point(2),start_point(3)+1, 'z','FontSize',18);

quiver3(start_point(1), start_point(2),start_point(3), vector(1), vector(2), vector(3), 'b-', 'LineWidth', 2);
text(start_point(1)+vector(1), start_point(2)+vector(2),start_point(3)+vector(3),'Vector','FontSize',18);

quiver3(0,0,0,0,0,3,1,'k','filled','LineWidth',2)
text(0,0,3.5,'z','FontSize',18)
quiver3(0,0,0,3,0,0,1,'k','filled','LineWidth',2)
text(3.5,0,0,'x','FontSize',18)
quiver3(0,0,0,0,3,0,1,'k','filled','LineWidth',2)
text(0,3.5,0,'y','FontSize',18)
view([1,1,1/2]);
axis equal;
alpha(0.8);         %设置透明度
shading flat;      %去掉经纬线
hold off;

% 球坐标系
figure(3); hold on; title('Spherical');
[x,y,z]=sphere(30);
R = normest(start_point);
x=R*x;        
y=R*y;
z=R*z;
surf(x,y,z);
quiver3(start_point(1), start_point(2),start_point(3), sin(theta2)*cos(phi2), sin(theta2)*sin(phi2), cos(theta2), 'y-', 'LineWidth', 2);
text(start_point(1)+sin(theta2)*cos(phi2), start_point(2)+sin(theta2)*sin(phi2),start_point(3)+cos(theta2),'R','FontSize',18);
quiver3(start_point(1), start_point(2),start_point(3), cos(theta2)*cos(phi2), cos(theta2)*sin(phi2), -sin(theta2), 'y-', 'LineWidth', 2);
text(start_point(1)+cos(theta2)*cos(phi2), start_point(2)+cos(theta2)*sin(phi2),start_point(3)-sin(theta2),'\theta','FontSize',18);
quiver3(start_point(1), start_point(2),start_point(3), -sin(phi2), cos(phi2), 0, 'y-', 'LineWidth', 2);
text(start_point(1)-sin(phi2), start_point(2)+cos(phi2),start_point(3),'\phi','FontSize',18);

quiver3(start_point(1), start_point(2),start_point(3), vector(1), vector(2), vector(3), 'b-', 'LineWidth', 2);
text(start_point(1)+vector(1), start_point(2)+vector(2),start_point(3)+vector(3),'Vector','FontSize',18);

quiver3(0,0,0,0,0,3,1,'k','filled','LineWidth',2)
text(0,0,3.5,'z','FontSize',18)
quiver3(0,0,0,3,0,0,1,'k','filled','LineWidth',2)
text(3.5,0,0,'x','FontSize',18)
quiver3(0,0,0,0,3,0,1,'k','filled','LineWidth',2)
text(0,3.5,0,'y','FontSize',18)
view([1,1,1/2]);
axis equal;
alpha(0.8);         %设置透明度
shading flat;      %去掉经纬线
hold off;