using Backend.DataAccess.Entities;

namespace Backend.API.Abstractions;

public interface IJwtService
{
    public string GetToken(UserEntity userEntity);
}