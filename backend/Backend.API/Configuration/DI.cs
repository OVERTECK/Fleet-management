using Backend.API.EndpointsSettings;
using Backend.API.Features.Cars;
using Backend.API.Services;
using Backend.DataAccess;
using Backend.DataAccess.Repositories;
using Microsoft.EntityFrameworkCore;
using Serilog;
using Serilog.Exceptions;

namespace Backend.API.Configuration;

public static class DI
{
    public static IServiceCollection AddConfiguration(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<CreateHandler>();
        services.AddScoped<GetAllCarsHadler>();
        services.AddScoped<GetByIdCarHandler>();

        return services
            .AddSerilogLogging(configuration)
            .AddOpenApiSpec()
            .AddCors()
            .AddScoped<CarsService>()
            .AddScoped<CarsRepository>()
            .AddMyDbContext(configuration)
            .AddEndpoints(typeof(DI).Assembly);
    }

    private static IServiceCollection AddOpenApiSpec(this IServiceCollection services)
    {
        services.AddOpenApi();

        services.AddEndpoints(typeof(Program).Assembly);

        services.AddSwaggerGen();

        return services;
    }

    private static IServiceCollection AddSerilogLogging(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddSerilog((services, lc) => lc
            .ReadFrom.Configuration(configuration)
            .ReadFrom.Services(services)
            .Enrich.FromLogContext()
            .Enrich.WithExceptionDetails()
            .Enrich.WithProperty("Application", "Backend.API"));

        return services;
    }

    private static IServiceCollection AddMyDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<MyDbContext>(options =>
        {
            options.UseNpgsql(configuration.GetConnectionString(nameof(MyDbContext)));
        });

        return services;
    }
}