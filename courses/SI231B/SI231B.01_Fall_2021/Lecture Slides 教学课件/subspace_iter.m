% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
% %
% % SI231b: Matrix Computations
% % ShanghaiTech University
% % Test code for the subspace iteration
% % Written by Yue Qiu
% %
% %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%


%%%%%%%%%%%%%%%%%%%%%%%%%%% real symmetric case %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

n = 50; % size of the tested matrix
r = 10;  % dimension of the invariant subspace to be computed
iter = 500;  % number of iterations

type = input('the type of tested matrix (1 for symmetric, else for unsymmetric)?   ');

rng(1e3)
lambda = randn(n, 1) + unifrnd(-20, 90, n, 1);   % random generate the eigenvalues
Lambda = diag(lambda);
Q = rand(n, n);

if type == 1
    [Q, ~] = qr(Q);     % a random eigenvector matrix
    A = Q*Lambda*Q';    % the real symmetric matrix A whose eigenvalues we need to compute
else
    nm = sqrt(sum(Q.^2, 1)); % compute the 2-norm of all columns
    Q = bsxfun(@rdivide, Q, nm); % normalize the matrix Q
    A = Q*Lambda/Q;
end

Z0 = randn(n, r);
[Q0, ~] = qr(Z0, 0);    % initial matrix with orthonormal columns

for i = 1 : iter
    Z = A*Q0;
    [Q0, ~] = qr(Z, 0);
end

% now we check the the r dominant eigenvectors with Q0
[~, indx] = sort(abs(lambda), 'descend');   % sort the eigenvalues using abosolute value
Qd = Q(:, indx);    % sort the eigenvectors to make the correspondence 
Qd = Qd(:, 1 : r);   % the eigenvectors corresponding to the r largest eigenvalues

fprintf('----- first check whether eigenvectors converge -------------\n\n\n')
fprintf('Q0^T*Qd equals \n')
Q0'*Qd   % to show whether Q0 converges to Qd

fprintf('----- first check whether eigenvalues converge -------------\n\n\n')
As = Q0'*A*Q0;
lam = eig(As);  % compute the eigenvalues
[~, index] = sort(abs(lam), 'descend'); % sort eigenvalues
lams = lam(index);  % sorted computed eigenvalues 
lambdas = lambda(indx);
lambdas = lambdas(1:r); % r largest eigenvalues of A

fprintf('----- difference between eigenvalues and computed eigenvalues are --------\n')
lams - lambdas
