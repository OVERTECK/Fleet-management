using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.API.Abstractions;
using Backend.DataAccess.Entities;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Backend.API.Services;

public class JwtService : IJwtService
{
    private readonly JwtOptions _jwtOptions;

    public JwtService(
        IOptions<JwtOptions> jwtOptions)
    {
        _jwtOptions = jwtOptions.Value;
    }

    public string GetToken(UserEntity userEntity)
    {
        var signingCredentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtOptions.SecretKey)),
            SecurityAlgorithms.HmacSha256);

        Claim[] claims = [
            new(ClaimTypes.NameIdentifier, userEntity.Id.ToString()),
            new(ClaimTypes.Role, userEntity.Role.Title)];

        var jwt = new JwtSecurityToken(
            signingCredentials: signingCredentials,
            // issuer: _jwtOptions.
            expires: DateTime.Now.AddHours(14),
            claims: claims);

        var token = new JwtSecurityTokenHandler().WriteToken(jwt);

        return token;
    }
}