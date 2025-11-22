namespace Backend.API.Abstractions;

public interface IJwtService
{
    public string GetToken(Guid id);
}